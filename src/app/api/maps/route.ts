import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import type { MapFilters, CreateMapPayload } from "@/types/api";
import { uploadFormFileToCloudinary } from "@/utils/cloudinary";

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

		const filters: MapFilters = {};

		const search = params.get("search")?.trim();
		const activeParam = params.get("active");
		const pageSize = parseInt(params.get("pageSize") || "0", 10);
		const pageNumber = parseInt(params.get("pageNumber") || "1", 10);

		if (search) {
			// const escapedSearch = escapeRegExp(search);
			const rx = new RegExp(escapeRegExp(search), "i");
			filters.$or = [{ title: rx }, { description: rx }];
		}

		if (activeParam !== null) {
			if (activeParam === "true" || activeParam === "false") {
				filters.active = activeParam === "true";
			}
		}

		const total = await Map.countDocuments(filters);

		let query = Map.find(filters).sort({ name: 1 });
		if (pageSize) {
			const skip = ((pageNumber ?? 1) - 1) * pageSize;
			query = query.limit(pageSize).skip(skip);
		}

		const maps = await query.exec();

		const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

		return NextResponse.json(
			{
				data: maps,
				pageNumber: pageNumber,
				pageSize: pageSize,
				total,
				totalPages,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("GET /api/maps error:", err);
		return NextResponse.json(
			{ error: "Failed to fetch maps" },
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	await connectToDatabase();

	try {
		const authError = await ensureAdmin(request);
		if (authError) return authError;

		// Accept multipart/form-data
		const contentType = request.headers.get("content-type") || "";
		const isMultipart = contentType.includes("multipart/form-data");
		let payload: CreateMapPayload | null = null;

		if (isMultipart) {
			const form = await request.formData();
			const name = String(form.get("name") || "")
				.trim()
				.toLowerCase();
			const title = String(form.get("title") || "").trim();
			const description = String(form.get("description") || "").trim();
			const activeRaw = form.get("active");
			const active =
				activeRaw != null
					? ["true", "1", "on"].includes(String(activeRaw).toLowerCase())
					: undefined;
			const imageFile = form.get("image");

			payload = { name, title, description, active, image: "" };

			if (!name || !title) {
				return NextResponse.json(
					{ error: "Name and title are required." },
					{ status: 400 }
				);
			}

			if (typeof imageFile === "string" && imageFile.trim()) {
				payload.image = imageFile.trim();
			}

			if (imageFile && imageFile instanceof File && imageFile.size > 0) {
				const res = await uploadFormFileToCloudinary(imageFile, "maps", name);
				payload.image = res.secure_url;
			}
		} else {
			const json = (await request.json()) as CreateMapPayload;

			payload = {
				name: json.name?.trim().toLowerCase(),
				title: json.title?.trim(),
				active: json.active,
				image: json.image?.trim(),
				description: json.description?.trim(),
			};
		}

		if (
			!payload.name ||
			!payload.title ||
			!payload.image ||
			!payload.description
		) {
			return NextResponse.json(
				{ error: "Missing required fields: name, title, image, description" },
				{ status: 400 }
			);
		}

		const map = new Map({
			name: payload.name,
			title: payload.title,
			active: typeof payload.active === "boolean" ? payload.active : true,
			image: payload.image,
			description: payload.description,
		});

		await map.save();
		revalidatePath("/cs2");
		revalidatePath(`/cs2/${map.name}`);

		return NextResponse.json(map, { status: 201 });
	} catch (error: unknown) {
		console.error("POST /api/maps error:", error);
		// Duplicate key
		if ((error as { code?: number })?.code === 11000) {
			return NextResponse.json(
				{ error: "There is already a map with this name." },
				{ status: 409 }
			);
		}

		return NextResponse.json({ error: "Error saving map" }, { status: 500 });
	}
}
