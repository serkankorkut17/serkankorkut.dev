import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { connectToDatabase } from "@/utils/database";
import { getUserIdFromRequest } from "@/utils/auth";
import { User } from "@/models/User";

type RoleTier = "admin" | "moderator" | "user" | "anonymous";

type LimitConfig = {
  maxMb: number;
  requestsPerMinute: number;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const RATE_WINDOW_MS = 60_000;
const rateStore = new Map<string, RateEntry>();

function parseEnvInt(name: string, fallback: number, min: number, max: number) {
  const raw = process.env[name];
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

function getLimitsByRole(role: RoleTier): LimitConfig {
  const admin = {
    maxMb: parseEnvInt("IMAGE_MAX_MB_ADMIN", 200, 1, 1024),
    requestsPerMinute: parseEnvInt("IMAGE_RATE_PER_MIN_ADMIN", 180, 1, 10_000),
  };

  const moderator = {
    maxMb: parseEnvInt("IMAGE_MAX_MB_MODERATOR", admin.maxMb, 1, 1024),
    requestsPerMinute: parseEnvInt(
      "IMAGE_RATE_PER_MIN_MODERATOR",
      admin.requestsPerMinute,
      1,
      10_000
    ),
  };

  const user = {
    maxMb: parseEnvInt("IMAGE_MAX_MB_USER", 75, 1, 1024),
    requestsPerMinute: parseEnvInt("IMAGE_RATE_PER_MIN_USER", 30, 1, 10_000),
  };

  const anonymous = {
    maxMb: parseEnvInt("IMAGE_MAX_MB_ANON", 20, 1, 1024),
    requestsPerMinute: parseEnvInt("IMAGE_RATE_PER_MIN_ANON", 10, 1, 10_000),
  };

  if (role === "admin") return admin;
  if (role === "moderator") return moderator;
  if (role === "user") return user;
  return anonymous;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "unknown";
}

function checkAndConsumeRateLimit(key: string, limitPerMinute: number) {
  const now = Date.now();
  const existing = rateStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (existing.count >= limitPerMinute) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, retryAfterSec };
  }

  existing.count += 1;
  rateStore.set(key, existing);
  return { allowed: true, retryAfterSec: 0 };
}

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.at(-1)?.toLowerCase() ?? "" : "";
}

function isAllowedImageFile(file: File) {
  const ext = getFileExtension(file.name);
  if (ext === "heic" || ext === "heif") return true;
  return file.type.startsWith("image/");
}

async function resolveRoleAndIdentity(request: NextRequest): Promise<{ role: RoleTier; identity: string }> {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return { role: "anonymous", identity: `ip:${getClientIp(request)}` };
  }

  await connectToDatabase();
  const user = (await User.findById(userId)
    .select("role")
    .lean()) as { role?: string } | null;

  const role =
    user?.role === "admin" || user?.role === "moderator" || user?.role === "user"
      ? user.role
      : "user";

  return { role, identity: `user:${userId}` };
}

export async function POST(request: NextRequest) {
  try {
    const { role, identity } = await resolveRoleAndIdentity(request);
    const limits = getLimitsByRole(role);

    const limiterKey = `image-convert:${role}:${identity}`;
    const rateResult = checkAndConsumeRateLimit(
      limiterKey,
      limits.requestsPerMinute
    );
    if (!rateResult.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Max ${limits.requestsPerMinute} requests per minute for ${role}.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateResult.retryAfterSec),
          },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const qualityValue = Number(formData.get("quality"));
    const effortValue = Number(formData.get("effort"));
    const maxDimensionValue = Number(formData.get("maxDimension"));
    const quality = Number.isFinite(qualityValue)
      ? Math.min(100, Math.max(1, qualityValue))
      : 75;
    const effort = Number.isFinite(effortValue)
      ? Math.min(6, Math.max(0, effortValue))
      : 4;
    const maxDimension = Number.isFinite(maxDimensionValue)
      ? Math.min(8192, Math.max(0, Math.round(maxDimensionValue)))
      : 0;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!isAllowedImageFile(file)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload an image file." },
        { status: 415 }
      );
    }

    const maxBytes = limits.maxMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          error: `File is too large. Maximum allowed size for ${role} is ${limits.maxMb}MB.`,
        },
        { status: 413 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const maxInputPixels = parseEnvInt(
      "IMAGE_MAX_INPUT_PIXELS",
      40_000_000,
      1_000_000,
      500_000_000
    );

    const inputMetadata = await sharp(buffer, {
      limitInputPixels: maxInputPixels,
    }).metadata();

    let pipeline = sharp(buffer, {
      limitInputPixels: maxInputPixels,
    });
    if (maxDimension > 0) {
      pipeline = pipeline.resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const { data: webpBuffer, info } = await pipeline
      .webp({ quality, effort })
      .toBuffer({ resolveWithObject: true });

    // Convert to base64 for JSON response
    const base64 = webpBuffer.toString("base64");

    // Get MIME type
    const mimeType = "image/webp";

    return NextResponse.json({
      success: true,
      base64Data: base64,
      mimeType,
      originalSize: buffer.length,
      convertedSize: webpBuffer.length,
      metadata: {
        originalWidth: inputMetadata.width,
        originalHeight: inputMetadata.height,
        width: info.width,
        height: info.height,
      },
    });
  } catch (error) {
    console.error("Image conversion error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Conversion failed",
      },
      { status: 500 }
    );
  }
}
