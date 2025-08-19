import mongoose from "mongoose";

const NadeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        map: { type: String, required: true },
        type: { type: String, required: true },
        side: { type: String, required: true },
        position: { type: String, required: true },
        landing: { type: String, required: true },
        throw: { type: [String], required: true },
        description: { type: String, required: true },
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
