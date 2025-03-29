import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";

export async function GET(request, { params }) {
    await connectToDatabase();
    const map = await Map.findOne({ name: params.name });
    if (!map) {
        return new Response("No map found", { status: 404 });
    }
    return Response.json(map);
}

export async function PUT(request, { params }) {
    await connectToDatabase();
    const data = await request.json();
    const map = await Map.findOneAndUpdate({ name: params.name }, data, {
        new: true,
    });
    if (!map) {
        return new Response("Map not found", { status: 404 });
    }
    return Response.json(map);
}
