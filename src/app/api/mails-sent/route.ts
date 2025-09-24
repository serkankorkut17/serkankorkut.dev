import { connectToDatabase } from "@/utils/database";
import { MailSent } from "@/models/MailSent";
import { getUserIdFromRequest } from "@/utils/auth";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET method to retrieve sent mails
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
    // Filter mails by authenticated user
    try {
        if (id) {
            const mail = await MailSent.findById(id).where({ userId });
            if (!mail) {
                return new Response(JSON.stringify({ error: "Not found" }), {
                    status: 404,
                });
            }
            return new Response(JSON.stringify(mail), { status: 200 });
        }
        const mails = await MailSent.find()
            .where({ userId })
            .sort({ createdAt: -1 });
        return new Response(JSON.stringify(mails), { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
        });
    }
}