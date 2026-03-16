import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
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

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const inputMetadata = await sharp(buffer).metadata();

    let pipeline = sharp(buffer);
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
