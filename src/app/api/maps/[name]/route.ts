import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    await connectToDatabase();
    const { name } = await params;

    const map = await Map.findOne({ name });
    if (!map) {
        return NextResponse.json({ error: "No map found" }, { status: 404 });
    }
    return NextResponse.json(map);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
    await connectToDatabase();
    const data = (await request.json()) as Partial<Record<string, unknown>>;

    const { name } = await params;

    const map = await Map.findOneAndUpdate({ name }, data, {
        new: true,
    });
    if (!map) {
        return NextResponse.json({ error: "Map not found" }, { status: 404 });
    }
    return NextResponse.json(map);
}
