import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import { NextResponse } from "next/server";

type Params = { params: { name: string } };

export async function GET(request: Request, { params }: Params) {
    await connectToDatabase();
    const { name } = await params;

    const map = await Map.findOne({ name });
    if (!map) {
        return NextResponse.json({ error: "No map found" }, { status: 404 });
    }
    return NextResponse.json(map);
}

export async function PUT(request: Request, { params }: Params) {
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
