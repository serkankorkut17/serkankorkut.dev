import mongoose from "mongoose";

const mapSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const Map = mongoose.models.Map || mongoose.model("Map", mapSchema);

export default Map;
