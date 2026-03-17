import {
	v2 as cloudinary,
	type UploadApiResponse,
	type UploadApiErrorResponse,
	type UploadApiOptions,
} from "cloudinary";

// Requires env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

export async function uploadFormFileToCloudinary(
	file: File,
	folder?: string,
	filename?: string
): Promise<UploadApiResponse> {
	if (!file) {
		throw new Error("No file provided");
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const uploadOptions: Record<string, unknown> = {
		resource_type: "image",
		folder: folder ?? undefined,
	};

	if (filename) {
		const uniqueName = `${filename}_${Date.now()}`;
		uploadOptions.public_id = uniqueName;
		uploadOptions.use_filename = true;
		uploadOptions.unique_filename = true;
	} else {
		uploadOptions.use_filename = true;
		uploadOptions.unique_filename = true;
	}

	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			uploadOptions,
			(
				error: UploadApiErrorResponse | undefined,
				res: UploadApiResponse | undefined
			) => {
				if (error || !res)
					return reject(error || new Error("Cloudinary upload failed"));
				resolve(res);
			}
		);
		stream.end(buffer);
	});

	return result;
}

type UploadNamedAssetOptions = {
	folder: string;
	publicId: string;
	resourceType?: "image" | "video" | "raw" | "auto";
	format?: string;
	overwrite?: boolean;
};

type UploadOriginalAssetOptions = {
	folder: string;
	resourceType?: "image" | "video" | "raw" | "auto";
	overwrite?: boolean;
};

function getFilenameWithoutExtension(filename: string): string {
	const trimmed = filename.trim();
	const lastDot = trimmed.lastIndexOf(".");
	if (lastDot <= 0) return trimmed;
	return trimmed.slice(0, lastDot);
}

export async function uploadNamedFormFileToCloudinary(
	file: File,
	options: UploadNamedAssetOptions
): Promise<UploadApiResponse> {
	if (!file) {
		throw new Error("No file provided");
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const uploadOptions: UploadApiOptions = {
		folder: options.folder,
		public_id: options.publicId,
		resource_type: options.resourceType ?? "image",
		overwrite: options.overwrite ?? true,
		unique_filename: false,
		use_filename: false,
	};

	if (options.format) {
		uploadOptions.format = options.format;
	}

	const result = await new Promise<UploadApiResponse>((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			uploadOptions,
			(
				error: UploadApiErrorResponse | undefined,
				res: UploadApiResponse | undefined
			) => {
				if (error || !res)
					return reject(error || new Error("Cloudinary upload failed"));
				resolve(res);
			}
		);
		stream.end(buffer);
	});

	return result;
}

export async function uploadOriginalNamedFormFileToCloudinary(
	file: File,
	options: UploadOriginalAssetOptions
): Promise<UploadApiResponse> {
	if (!file) {
		throw new Error("No file provided");
	}

	const baseName = getFilenameWithoutExtension(file.name)
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-_]/g, "")
		.trim();

	if (!baseName) {
		throw new Error("Invalid original filename");
	}

	return uploadNamedFormFileToCloudinary(file, {
		folder: options.folder,
		publicId: baseName,
		resourceType: options.resourceType,
		overwrite: options.overwrite,
	});
}

function extractCloudinaryPublicIdFromUrl(url: string): string | null {
	if (!url || !url.includes("res.cloudinary.com")) {
		return null;
	}

	try {
		const parsed = new URL(url);
		const segments = parsed.pathname.split("/").filter(Boolean);
		const uploadIndex = segments.findIndex((segment) => segment === "upload");
		if (uploadIndex === -1) return null;

		const afterUpload = segments.slice(uploadIndex + 1);
		const versionOffset = afterUpload[0]?.startsWith("v") ? 1 : 0;
		const publicIdWithExt = afterUpload.slice(versionOffset).join("/");
		if (!publicIdWithExt) return null;

		const lastDot = publicIdWithExt.lastIndexOf(".");
		if (lastDot === -1) return publicIdWithExt;
		return publicIdWithExt.slice(0, lastDot);
	} catch {
		return null;
	}
}

export async function deleteCloudinaryAssetByUrl(
	url: string,
	resourceType: "image" | "video" | "raw" = "image"
): Promise<boolean> {
	const publicId = extractCloudinaryPublicIdFromUrl(url);
	if (!publicId) {
		return false;
	}

	const result = await cloudinary.uploader.destroy(publicId, {
		resource_type: resourceType,
		invalidate: true,
	});

	return result.result === "ok" || result.result === "not found";
}

export default cloudinary;
