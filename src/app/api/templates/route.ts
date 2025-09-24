import { connectToDatabase } from "@/utils/database";
import { Template } from "@/models/Template";
import { getUserIdFromRequest } from "@/utils/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET method to retrieve templates
export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }

    if (id) {
        const template = await Template.findById(id).where({ userId });
        return new NextResponse(JSON.stringify(template), { status: 200 });
    } else {
        const templates = await Template.find().where({ userId });
        return new NextResponse(JSON.stringify(templates), { status: 200 });
    }
}

// POST method to create a new template
export async function POST(req: NextRequest) {
    await connectToDatabase();
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }

    const body = await req.json();
    const newTemplate = await Template.create({ ...body, userId });
    return new Response(JSON.stringify(newTemplate), { status: 201 });
}

// PUT method to update a template
export async function PUT(req: NextRequest) {
    await connectToDatabase();
    const body = await req.json();
    const { id, update } = body;
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }
    if (!id) {
        return new Response(JSON.stringify({ error: "ID is required" }), {
            status: 400,
        });
    }
    // Check if the template exists and belongs to the user
    const template = await Template.findById(id).where({ userId });
    if (!template) {
        return new Response(JSON.stringify({ error: "Template not found" }), {
            status: 404,
        });
    }
    // Update the template
    if (!update || Object.keys(update).length === 0) {
        return new Response(
            JSON.stringify({ error: "No update data provided" }),
            {
                status: 400,
            }
        );
    }
    await Template.findByIdAndUpdate(id, update);
    return new Response("Updated", { status: 200 });
}

// DELETE method to delete a template
export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }
    if (!id) {
        return new NextResponse(JSON.stringify({ error: "ID is required" }), {
            status: 400,
        });
    }
    // Check if the template exists and belongs to the user
    const template = await Template.findById(id).where({ userId });
    if (!template) {
        return new Response(JSON.stringify({ error: "Template not found" }), {
            status: 404,
        });
    }
    // Delete the template
    await Template.findByIdAndDelete(id);
    return new Response("Deleted", { status: 200 });
}