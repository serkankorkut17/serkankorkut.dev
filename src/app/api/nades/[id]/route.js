import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";

export async function GET(request, { params }) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const nade = await Nade.findById(id);
        if (!nade) {
            return new Response(JSON.stringify({ error: "Nade not found" }), {
                status: 404,
            });
        }
        return new Response(JSON.stringify(nade), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
        });
    }
}

export async function PUT(request, { params }) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const updatedNade = await Nade.findByIdAndUpdate(params.id, body, {
            new: true,
        });
        if (!updatedNade) {
            return new Response(JSON.stringify({ error: "Nade not found" }), {
                status: 404,
            });
        }
        return new Response(JSON.stringify(updatedNade), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
        });
    }
}
