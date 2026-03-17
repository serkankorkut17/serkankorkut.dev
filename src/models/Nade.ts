import mongoose from "mongoose";

const ALLOWED_NADE_TYPES = ["flash", "grenade", "molotov", "smoke"] as const;

const NadeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		map: {
			type: String, // reference to Map name
			required: true,
			ref: "Map"
		},
		type: {
			type: String,
			enum: ALLOWED_NADE_TYPES,
			required: true
		},
		side: {
			type: String,	// "T" or "CT"
			required: true
		},
		position: {
			type: String,
			required: true
		},
		landing: {
			type: String,
			required: true
		},
		throw: {
			type: [String],
			required: true
		},
		description: {
			type: String,
			required: true
		},
		images: {
			location: { type: String, required: true },
			placement: { type: String, required: true },
			lineup: { type: [String], required: true },
			land: { type: String, required: true },
		},
		video: { type: String, required: true },
	},
	{ timestamps: true }
);

export default mongoose.models.Nade || mongoose.model("Nade", NadeSchema);
