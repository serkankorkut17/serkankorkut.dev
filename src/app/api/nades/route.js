import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";

export async function GET() {
    await connectToDatabase();
    try {
        const nades = await Nade.find({});
        return new Response(JSON.stringify(nades), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Nades are not found" }), {
            status: 404,
        });
    }
}

export async function POST(request) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const nade = new Nade(body);
        await nade.save();
        return new Response(JSON.stringify(nade), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
        });
    }
}
