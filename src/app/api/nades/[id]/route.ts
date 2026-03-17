import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import {
    deleteCloudinaryAssetByUrl,
    uploadNamedFormFileToCloudinary,
    uploadOriginalNamedFormFileToCloudinary,
} from "@/utils/cloudinary";
import { revalidatePath } from "next/cache";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const nade = await Nade.findById(id);
        if (!nade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }
        return NextResponse.json(nade);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    try {
        const authError = await ensureAdmin(request);
        if (authError) return authError;

        const { id } = await params;
        const existingNade = await Nade.findById(id);
        if (!existingNade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }

        const contentType = request.headers.get("content-type") || "";
        let updatePayload: Record<string, unknown> = {};

        if (contentType.includes("multipart/form-data")) {
            const form = await request.formData();

            const name = String(form.get("name") || existingNade.name).trim();
            const map = String(form.get("map") || existingNade.map)
                .trim()
                .toLowerCase();
            const type = String(form.get("type") || existingNade.type)
                .trim()
                .toLowerCase();
            const side = String(form.get("side") || existingNade.side).trim();
            const position = String(form.get("position") || existingNade.position).trim();
            const landing = String(form.get("landing") || existingNade.landing).trim();
            const description = String(form.get("description") || existingNade.description).trim();
            const throwRaw = String(form.get("throw") || "").trim();
            const lineupKeepRaw = String(form.get("lineupKeepUrls") || "").trim();

            if (!ALLOWED_NADE_TYPES.has(type)) {
                return NextResponse.json(
                    { error: "Invalid nade type. Allowed: flash, grenade, molotov, smoke." },
                    { status: 400 }
                );
            }

            const nadeSlug = slugify(name);
            const folder = `nades/${map}/${nadeSlug}`;

            const videoFile = form.get("video");
            const locationFile = form.get("locationImage");
            const placementFile = form.get("placementImage");
            const landFile = form.get("landImage");
            const lineupFiles = form
                .getAll("lineupImages")
                .filter((entry): entry is File => entry instanceof File && entry.size > 0);

            let videoUrl = existingNade.video;
            let locationUrl = existingNade.images.location;
            let placementUrl = existingNade.images.placement;
            let landUrl = existingNade.images.land;
            let keptExistingLineupUrls = existingNade.images.lineup;

            if (lineupKeepRaw) {
                try {
                    const parsed = JSON.parse(lineupKeepRaw) as unknown;
                    if (Array.isArray(parsed)) {
                        const requestedKeeps = parsed
                            .map((entry) => String(entry).trim())
                            .filter(Boolean);
                        keptExistingLineupUrls = existingNade.images.lineup.filter((url: string) =>
                            requestedKeeps.includes(url)
                        );
                    }
                } catch {
                    // ignore malformed keep list and keep existing lineup as-is
                }
            }

            const removedExistingLineupUrls = existingNade.images.lineup.filter(
                (url: string) => !keptExistingLineupUrls.includes(url)
            );

            if (removedExistingLineupUrls.length > 0) {
                await Promise.allSettled(
                    removedExistingLineupUrls.map((url: string) =>
                        deleteCloudinaryAssetByUrl(url, "image")
                    )
                );
            }

            let lineupUrls = keptExistingLineupUrls;

            if (videoFile instanceof File && videoFile.size > 0) {
                const uploaded = await uploadOriginalNamedFormFileToCloudinary(videoFile, {
                    folder,
                    resourceType: "video",
                });
                videoUrl = uploaded.secure_url;
            }

            if (locationFile instanceof File && locationFile.size > 0) {
                const uploaded = await uploadNamedFormFileToCloudinary(locationFile, {
                    folder,
                    publicId: "location",
                    resourceType: "image",
                    format: "png",
                });
                locationUrl = uploaded.secure_url;
            }

            if (placementFile instanceof File && placementFile.size > 0) {
                const uploaded = await uploadNamedFormFileToCloudinary(placementFile, {
                    folder,
                    publicId: "placement",
                    resourceType: "image",
                    format: "png",
                });
                placementUrl = uploaded.secure_url;
            }

            if (landFile instanceof File && landFile.size > 0) {
                const uploaded = await uploadNamedFormFileToCloudinary(landFile, {
                    folder,
                    publicId: "land",
                    resourceType: "image",
                    format: "png",
                });
                landUrl = uploaded.secure_url;
            }

            if (lineupFiles.length > 0) {
                const uploadedLineups = await Promise.all(
                    lineupFiles.map((file, index) =>
                        uploadNamedFormFileToCloudinary(file, {
                            folder,
                            publicId: `lineup-${keptExistingLineupUrls.length + index + 1}`,
                            resourceType: "image",
                            format: "png",
                        })
                    )
                );
                lineupUrls = [
                    ...keptExistingLineupUrls,
                    ...uploadedLineups.map((item) => item.secure_url),
                ];
            }

            if (lineupUrls.length === 0) {
                return NextResponse.json(
                    { error: "At least one lineup image is required." },
                    { status: 400 }
                );
            }

            const throwValues = throwRaw
                ? parseThrowValues(throwRaw)
                : existingNade.throw;

            updatePayload = {
                name,
                map,
                type,
                side,
                position,
                landing,
                description,
                throw: throwValues,
                video: videoUrl,
                images: {
                    location: locationUrl,
                    placement: placementUrl,
                    land: landUrl,
                    lineup: lineupUrls,
                },
            };
        } else {
            const body = (await request.json()) as Record<string, unknown>;
            if (typeof body.type === "string") {
                const normalizedType = body.type.trim().toLowerCase();
                if (!ALLOWED_NADE_TYPES.has(normalizedType)) {
                    return NextResponse.json(
                        { error: "Invalid nade type. Allowed: flash, grenade, molotov, smoke." },
                        { status: 400 }
                    );
                }
                body.type = normalizedType;
            }
            updatePayload = body;
        }

        const updatedNade = await Nade.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        });
        if (!updatedNade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }

        if (
            typeof updatePayload.video === "string" &&
            updatePayload.video &&
            existingNade.video &&
            updatePayload.video !== existingNade.video
        ) {
            try {
                await deleteCloudinaryAssetByUrl(existingNade.video, "video");
            } catch (error) {
                console.error("Failed to delete old nade video from Cloudinary:", error);
            }
        }

        revalidatePath("/cs2");
        revalidatePath(`/cs2/${updatedNade.map}`);
        return NextResponse.json(updatedNade);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();

    try {
        const authError = await ensureAdmin(request);
        if (authError) return authError;

        const { id } = await params;
        const deletedNade = await Nade.findByIdAndDelete(id);

        if (!deletedNade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }

        if (deletedNade.video) {
            try {
                await deleteCloudinaryAssetByUrl(deletedNade.video, "video");
            } catch (error) {
                console.error("Failed to delete nade video from Cloudinary:", error);
            }
        }

        const imageUrlsToDelete = [
            deletedNade.images?.location,
            deletedNade.images?.placement,
            deletedNade.images?.land,
            ...(deletedNade.images?.lineup || []),
        ].filter((value): value is string => Boolean(value));

        if (imageUrlsToDelete.length > 0) {
            await Promise.allSettled(
                imageUrlsToDelete.map((url) => deleteCloudinaryAssetByUrl(url, "image"))
            );
        }

        revalidatePath("/cs2");
        revalidatePath(`/cs2/${deletedNade.map}`);

        return NextResponse.json({ message: "Nade deleted" }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
