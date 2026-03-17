import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import { User } from "@/models/User";
import { uploadFormFileToCloudinary } from "@/utils/cloudinary";
import { getUserIdFromRequest } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { UpdateMapPayload } from "@/types/api";

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

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    await connectToDatabase();
    const { name } = await params;

    const map = await Map.findOne({ name });
    if (!map) {
        return NextResponse.json({ error: "No map found" }, { status: 404 });
    }
    return NextResponse.json(map);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    await connectToDatabase();
    const authError = await ensureAdmin(request);
    if (authError) return authError;

    const { name } = await params;
    const contentType = request.headers.get("content-type") || "";
    const isMultipart = contentType.includes("multipart/form-data");
    const updateData: UpdateMapPayload = {};

    if (isMultipart) {
        const form = await request.formData();
        const title = String(form.get("title") || "").trim();
        const description = String(form.get("description") || "").trim();
        const activeRaw = form.get("active");
        const formName = String(form.get("name") || "").trim().toLowerCase();
        const imageEntry = form.get("image");

        if (formName && formName !== name) {
            return NextResponse.json(
                { error: "Map name cannot be changed." },
                { status: 400 }
            );
        }

        if (title) updateData.title = title;
        if (description) updateData.description = description;

        if (activeRaw !== null) {
            updateData.active = ["true", "1", "on"].includes(
                String(activeRaw).toLowerCase()
            );
        }

        if (typeof imageEntry === "string" && imageEntry.trim()) {
            updateData.image = imageEntry.trim();
        }

        if (imageEntry instanceof File && imageEntry.size > 0) {
            const uploaded = await uploadFormFileToCloudinary(imageEntry, "maps", name);
            updateData.image = uploaded.secure_url;
        }
    } else {
        const data = (await request.json()) as UpdateMapPayload;

        if (data.name && data.name.trim().toLowerCase() !== name) {
            return NextResponse.json(
                { error: "Map name cannot be changed." },
                { status: 400 }
            );
        }

        if (typeof data.title === "string" && data.title.trim()) {
            updateData.title = data.title.trim();
        }
        if (typeof data.description === "string" && data.description.trim()) {
            updateData.description = data.description.trim();
        }
        if (typeof data.image === "string" && data.image.trim()) {
            updateData.image = data.image.trim();
        }
        if (typeof data.active === "boolean") {
            updateData.active = data.active;
        }
    }

    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
            { error: "No valid update fields provided." },
            { status: 400 }
        );
    }

    const map = await Map.findOneAndUpdate({ name }, { $set: updateData }, {
        new: true,
        runValidators: true,
    });
    if (!map) {
        return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }
    revalidatePath("/cs2");
    revalidatePath(`/cs2/${name}`);
    return NextResponse.json(map);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    await connectToDatabase();
    const authError = await ensureAdmin(request);
    if (authError) return authError;

    const { name } = await params;
    const deleted = await Map.findOneAndDelete({ name });

    if (!deleted) {
        return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }

    revalidatePath("/cs2");
    revalidatePath(`/cs2/${name}`);

    return NextResponse.json({ message: "Map deleted" }, { status: 200 });
}
