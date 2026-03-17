import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/utils/auth";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import { decrypt } from "@/utils/crypto";
import Imap from "imap";
import { simpleParser } from "mailparser";
// import fs from "fs";
// import path from "path";

export async function GET(req: NextRequest): Promise<Response> {
    await connectToDatabase();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "20", 10);

    const userId = getUserIdFromRequest(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await User.findById(userId).select("mailSetting");
    if (!user || !user.mailSetting)
        return NextResponse.json(
            { error: "No mail settings" },
            { status: 404 }
        );

    const { type, email, password, host, port, secure } = user.mailSetting;
    if (!email || !password || !type) {
        return NextResponse.json(
            { error: "Incomplete mail settings" },
            { status: 400 }
        );
    }

    let realPassword = "";
    try {
        realPassword = decrypt(password);
    } catch {
        return NextResponse.json(
            { error: "Stored mail password could not be decrypted." },
            { status: 400 }
        );
    }

    let imapConfig: Imap.Config;

    if (type === "gmail") {
        imapConfig = {
            user: email,
            password: realPassword,
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        };
    } else if (type === "outlook") {
        imapConfig = {
            user: email,
            password: realPassword,
            host: "outlook.office365.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        };
    } else if (type === "yahoo") {
        imapConfig = {
            user: email,
            password: realPassword,
            host: "imap.mail.yahoo.com",
            port: 993,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
        };
    } else if (type === "smtp" || type === "custom") {
        const parsedPort = parseInt(String(port || ""), 10);
        if (!host || Number.isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
            return NextResponse.json(
                { error: "Invalid custom IMAP host/port" },
                { status: 400 }
            );
        }

        imapConfig = {
            user: email,
            password: realPassword,
            host,
            port: parsedPort,
            tls: typeof secure === "boolean" ? secure : true,
            tlsOptions: { rejectUnauthorized: false },
        };
    } else {
        return NextResponse.json(
            { error: "Unsupported mail service type" },
            { status: 400 }
        );
    }

    const imap = new Imap(imapConfig);

    function openInbox(cb: (err: Error | null, box?: Imap.Box) => void) {
        imap.openBox("INBOX", true, cb);
    }

    return new Promise<Response>((resolve) => {
        imap.once("ready", function () {
            openInbox(function (err, box) {
                if (err) {
                    imap.end();
                    resolve(
                        NextResponse.json(
                            { error: "IMAP error" },
                            { status: 500 }
                        )
                    );
                    return;
                }
                const total = box?.messages.total || 0;
                // En yeni maillerden başla
                const start = total - (page - 1) * limit;
                const end = Math.max(start - limit + 1, 1);
                if (start < 1) {
                    imap.end();
                    resolve(NextResponse.json({ mails: [] }));
                    return;
                }
                // IMAP fetch aralığı: büyükten küçüğe (örn: 100:81)
                const f = imap.seq.fetch(`${start}:${end}`, {
                    bodies: "",
                    struct: true,
                });
                type Mail = {
                    subject: string | undefined;
                    from: string | undefined;
                    date: Date | undefined;
                    text: string | undefined;
                    html: string | false | undefined;
                    hasHtml: boolean;
                    attachments: {
                        filename: string | undefined;
                        contentType: string | undefined;
                        size: number | undefined;
                    }[];
                };
                const mails: Mail[] = [];
                f.on("message", function (msg) {
                    let mailBuffer = "";
                    msg.on("body", function (stream) {
                        stream.on("data", function (chunk) {
                            mailBuffer += chunk.toString("utf8");
                        });
                    });
                    msg.once("end", async function () {
                        const parsed = await simpleParser(mailBuffer);
                        mails.push({
                            subject: parsed.subject,
                            from: parsed.from?.text,
                            date: parsed.date,
                            text: parsed.text,
                            html: parsed.html,
                            hasHtml: !!parsed.html,
                            attachments:
                                parsed.attachments?.map((att) => ({
                                    filename: att.filename,
                                    contentType: att.contentType,
                                    size: att.size,
                                })) || [],
                        });
                        // write to file
                        // const filePath = path.join(
                        //     process.cwd(),
                        //     "tmp",
                        //     "mails.txt"
                        // );
                        // fs.mkdirSync(path.dirname(filePath), {
                        //     recursive: true,
                        // });
                        // fs.writeFileSync(
                        //     filePath,
                        //     JSON.stringify(mails[0]),
                        //     "utf8"
                        // );
                    });
                });
                f.once("end", function () {
                    imap.end();
                    resolve(
                        NextResponse.json({ mails: mails.reverse(), total })
                    );
                });
            });
        });
        imap.once("error", function (err: Error) {
            console.error("IMAP error:", err);
            resolve(
                NextResponse.json(
                    { error: "IMAP connection failed", detail: err.message },
                    { status: 500 }
                )
            );
        });
        imap.connect();
    });
}