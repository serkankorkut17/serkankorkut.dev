import { connectToDatabase } from "@/utils/database";
import { MailList } from "@/models/MailList";
import { getUserIdFromRequest } from "@/utils/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET method to retrieve mail lists
export async function GET(req: NextRequest) {
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

    // Filter mail lists by authenticated user
    try {
        if (id) {
            const mailList = await MailList.findById(id).where({ userId });
            if (!mailList) {
                return new Response(JSON.stringify({ error: "Not found" }), {
                    status: 404,
                });
            }
            return new NextResponse(JSON.stringify(mailList), { status: 200 });
        }
        const mailLists = await MailList.find().where({ userId });
        return new NextResponse(JSON.stringify(mailLists), { status: 200 });
    } catch (error: unknown) {
        return new NextResponse(JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }), {
            status: 500,
        });
    }
}

// POST method to create a new mail list
export async function POST(req: NextRequest) {
    await connectToDatabase();
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }
    // Parse the request body to get the mail list data
    const body = await req.json();

    // Create a new mail list
    try {
        const newMailList = await MailList.create({ ...body, userId });
        return new NextResponse(JSON.stringify(newMailList), { status: 201 });
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
            { status: 500 }
        );
    }
}

// PATCH method to update an existing mail list
export async function PATCH(req: NextRequest) {
    await connectToDatabase();
    const { id, ...updates } = await req.json();

    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }
    // Ensure the mail list belongs to the authenticated user
    const mailList = await MailList.findById(id).where({ userId });
    if (!mailList) {
        return new NextResponse(JSON.stringify({ error: "Not found" }), {
            status: 404,
        });
    }

    try {
        const updatedMailList = await MailList.findByIdAndUpdate(id, updates, {
            new: true,
        });
        return new NextResponse(JSON.stringify(updatedMailList), { status: 200 });
    } catch (error: unknown) {
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
            { status: 500 }
        );
    }
}

// DELETE method to delete a mail list
export async function DELETE(req: NextRequest) {
    await connectToDatabase();
    const { id } = await req.json();

    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId) {
        return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
        });
    }
    // Ensure the mail list belongs to the authenticated user
    const mailList = await MailList.findById(id).where({ userId });
    if (!mailList) {
        return new NextResponse(JSON.stringify({ error: "Not found" }), {
            status: 404,
        });
    }

    try {
        await MailList.findByIdAndDelete(id);
        return new NextResponse(
            JSON.stringify({ message: "Mail list deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
            { status: 500 }
        );
    }
}