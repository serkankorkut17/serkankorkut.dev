import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";

export async function GET() {
    await connectToDatabase();
    const maps = await Map.find({});
    return Response.json(maps);
}

export async function POST(request) {
    await connectToDatabase();
    const data = await request.json();
    try {
        const map = new Map(data);
        await map.save();
        return Response.json(map, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return new Response("There is already a map with this name.", {
                status: 409,
            });
        }
        return new Response("Error saving map", {
            status: 500,
        });
    }
}
