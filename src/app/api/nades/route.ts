import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";
import type { NadeFilters } from "@/types/api";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import {
    uploadNamedFormFileToCloudinary,
    uploadOriginalNamedFormFileToCloudinary,
} from "@/utils/cloudinary";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_NADE_TYPES = new Set(["flash", "grenade", "molotov", "smoke"]);

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-+/g, "-");
}

function parseThrowValues(raw: string): string[] {
    if (!raw.trim()) return [];
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
            return parsed
                .map((entry) => String(entry).trim())
                .filter(Boolean);
        }
    } catch {
        // fallback to comma-based parsing
    }

    return raw
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
}

async function ensureAdmin(request: NextRequest) {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = (await User.findById(userId)
        .select("role")
        .lean()) as { role?: string } | null;
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
}

export async function GET(request: Request) {
    await connectToDatabase();
    try {
        const url = new URL(request.url);
		const params = url.searchParams;

        const filters: NadeFilters = {};

        const search = params.get("search")?.trim();
		const type = params.get("type");
		const side = params.get("side");
		const map = params.get("map");
		const pageSize = parseInt(params.get("pageSize") || "0", 10);
		const pageNumber = parseInt(params.get("pageNumber") || "1", 10);

        if (search) {
            const escapeForRegex = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const pattern = escapeForRegex(search).replace(/[\s_-]+/g, "[-_\\s]+");
            const rx = new RegExp(pattern, "i");
            filters.$or = [
                { name: rx },
                { landing: rx },
                { position: rx },

            ];
        }

        if (type) {
            filters.type = type;
        }

        if (side) {
            filters.side = side;
        }

        if (map) {
            filters.map = map;
        }

        const total = await Nade.countDocuments(filters);

        let query = Nade.find(filters).sort({ name: 1 });
        if (pageSize) {
			const skip = ((pageNumber ?? 1) - 1) * pageSize;
			query = query.limit(pageSize).skip(skip);
		}

        const nades = await query.exec();

        const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

        return NextResponse.json(
            {
                data: nades,
                pageNumber: pageNumber,
                pageSize: pageSize,
                total,
                totalPages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/nades error:", error);
        return NextResponse.json({ error: "Failed to fetch nades" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    await connectToDatabase();

    try {
        const authError = await ensureAdmin(request);
        if (authError) return authError;

        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return NextResponse.json(
                { error: "Expected multipart/form-data payload." },
                { status: 400 }
            );
        }

        const form = await request.formData();
        const name = String(form.get("name") || "").trim();
        const map = String(form.get("map") || "").trim().toLowerCase();
        const type = String(form.get("type") || "").trim();
        const side = String(form.get("side") || "").trim();
        const position = String(form.get("position") || "").trim();
        const landing = String(form.get("landing") || "").trim();
        const description = String(form.get("description") || "").trim();
        const throwRaw = String(form.get("throw") || "");

        const videoFile = form.get("video");
        const locationFile = form.get("locationImage");
        const placementFile = form.get("placementImage");
        const landFile = form.get("landImage");
        const lineupFiles = form
            .getAll("lineupImages")
            .filter((entry): entry is File => entry instanceof File && entry.size > 0);

        if (
            !name ||
            !map ||
            !type ||
            !side ||
            !position ||
            !landing ||
            !description
        ) {
            return NextResponse.json(
                { error: "Missing required text fields." },
                { status: 400 }
            );
        }

        if (!ALLOWED_NADE_TYPES.has(type.toLowerCase())) {
            return NextResponse.json(
                { error: "Invalid nade type. Allowed: flash, grenade, molotov, smoke." },
                { status: 400 }
            );
        }

        if (!(videoFile instanceof File) || videoFile.size === 0) {
            return NextResponse.json(
                { error: "Video file is required." },
                { status: 400 }
            );
        }

        if (!(locationFile instanceof File) || locationFile.size === 0) {
            return NextResponse.json(
                { error: "location.png is required." },
                { status: 400 }
            );
        }

        if (!(placementFile instanceof File) || placementFile.size === 0) {
            return NextResponse.json(
                { error: "placement.png is required." },
                { status: 400 }
            );
        }

        if (!(landFile instanceof File) || landFile.size === 0) {
            return NextResponse.json(
                { error: "land.png is required." },
                { status: 400 }
            );
        }

        if (lineupFiles.length === 0) {
            return NextResponse.json(
                { error: "At least one lineup image is required." },
                { status: 400 }
            );
        }

        const nadeSlug = slugify(name);
        if (!nadeSlug) {
            return NextResponse.json(
                { error: "Invalid nade name." },
                { status: 400 }
            );
        }

        const folder = `nades/${map}/${nadeSlug}`;

        const videoUpload = await uploadOriginalNamedFormFileToCloudinary(videoFile, {
            folder,
            resourceType: "video",
        });

        const locationUpload = await uploadNamedFormFileToCloudinary(locationFile, {
            folder,
            publicId: "location",
            resourceType: "image",
            format: "png",
        });

        const placementUpload = await uploadNamedFormFileToCloudinary(placementFile, {
            folder,
            publicId: "placement",
            resourceType: "image",
            format: "png",
        });

        const landUpload = await uploadNamedFormFileToCloudinary(landFile, {
            folder,
            publicId: "land",
            resourceType: "image",
            format: "png",
        });

        const lineupUploads = await Promise.all(
            lineupFiles.map((file, index) =>
                uploadNamedFormFileToCloudinary(file, {
                    folder,
                    publicId: `lineup-${index + 1}`,
                    resourceType: "image",
                    format: "png",
                })
            )
        );

        const throwValues = parseThrowValues(throwRaw);
        if (throwValues.length === 0) {
            return NextResponse.json(
                { error: "Throw values are required." },
                { status: 400 }
            );
        }

        const nade = await Nade.create({
            name,
            map,
            type: type.toLowerCase(),
            side,
            position,
            landing,
            throw: throwValues,
            description,
            video: videoUpload.secure_url,
            images: {
                location: locationUpload.secure_url,
                placement: placementUpload.secure_url,
                land: landUpload.secure_url,
                lineup: lineupUploads.map((item) => item.secure_url),
            },
        });

        revalidatePath("/cs2");
        revalidatePath(`/cs2/${map}`);

        return NextResponse.json(nade, { status: 201 });
    } catch (error) {
        console.error("POST /api/nades error:", error);
        return NextResponse.json(
            { error: "Failed to create nade" },
            { status: 500 }
        );
    }
}

// export async function POST(request: Request) {
//     await connectToDatabase();
//     try {
//         const body = await request.json();
//         const nade = new Nade(body);
//         await nade.save();
//         return new Response(JSON.stringify(nade), { status: 201 });
//     } catch (error) {
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 400,
//         });
//     }
// }
