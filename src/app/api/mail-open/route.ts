import { connectToDatabase } from "@/utils/database";
import { MailSent } from "@/models/MailSent";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const mailSentId = searchParams.get("mailSentId");
    const email = searchParams.get("email");

    // If mailSentId or email is missing, return a 400 error
    if (!mailSentId || !email) {
        return new NextResponse("Missing parameters", { status: 400 });
    }

    // User-agent Controller: Google’s proxy requests
    const ua = req.headers.get("user-agent")?.toLowerCase() || "";
    const isProxy =
        ua.includes("google image proxy") ||
        ua.includes("google-image-proxy") ||
        ua.includes("feedfetcher") ||
        ua.includes("facebookexternalhit");

    // If the request is from a proxy, we don't update the status
    if (!isProxy) {
        // 2) Update the MailSent document to mark the email as opened
        await MailSent.updateOne(
            { _id: mailSentId, "receivers.email": email },
            {
                $set: {
                    "receivers.$.status": "opened",
                    "receivers.$.openedAt": new Date(),
                },
            }
        );
    }

    // if (!isProxy) {
    //     // MailSent ve receiver'ı bul
    //     const mailSent = await MailSent.findOne(
    //         { _id: mailSentId, "receivers.email": email },
    //         { "receivers.$": 1, sentAt: 1 }
    //     );
    //     if (mailSent && mailSent.sentAt) {
    //         const receiver = mailSent.receivers[0];
    //         const sentAt = new Date(mailSent.sentAt).getTime();
    //         const now = Date.now();
    //         // 3 saniyeden kısa sürede açıldıysa muhtemelen otomatik/proxy isteği
    //         if (now - sentAt > 3000) {
    //             await MailSent.updateOne(
    //                 { _id: mailSentId, "receivers.email": email },
    //                 {
    //                     $set: {
    //                         "receivers.$.status": "opened",
    //                         "receivers.$.openedAt": new Date(),
    //                     },
    //                 }
    //             );
    //         }
    //     }
    // }

    // Return 1x1 transparent GIF
    const gif = "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
    const buffer = Buffer.from(gif, "base64");
    return new NextResponse(buffer, {
        status: 200,
        headers: {
            "Content-Type": "image/gif",
            "Content-Length": buffer.length.toString(),
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
        },
    });
}