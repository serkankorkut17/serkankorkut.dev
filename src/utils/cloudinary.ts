import {
	v2 as cloudinary,
	type UploadApiResponse,
	type UploadApiErrorResponse,
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

export default cloudinary;
