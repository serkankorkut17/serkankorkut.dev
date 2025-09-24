import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await connectToDatabase();
    try {
        const nade = await Nade.findById(id);
        if (!nade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }
        return NextResponse.json(nade);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    try {
        const body = await request.json();
        const { id } = await params;
        const updatedNade = await Nade.findByIdAndUpdate(id, body, {
            new: true,
        });
        if (!updatedNade) {
            return NextResponse.json({ error: "Nade not found" }, { status: 404 });
        }
        return NextResponse.json(updatedNade);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
}
