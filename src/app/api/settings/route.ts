import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import { encrypt, decrypt } from "@/utils/crypto";

const VALID_MAIL_TYPES = ["gmail", "outlook", "yahoo", "smtp", "custom"] as const;

type MailType = (typeof VALID_MAIL_TYPES)[number];

type MailSettingInput = {
    type?: string;
    email?: string;
    password?: string;
    host?: string;
    port?: number | string;
    secure?: boolean;
    name?: string;
};

function isMailType(value: string): value is MailType {
    return VALID_MAIL_TYPES.includes(value as MailType);
}

// GET method to retrieve user mail settings
export async function GET(req: NextRequest) {
    await connectToDatabase();

    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Find the user by ID and select only the mailSetting field
    const user = await User.findById(userId).select("mailSetting");
    if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.mailSetting) {
        return NextResponse.json({ mailSetting: null });
    }

    let decryptedPassword = "";
    if (user.mailSetting.password) {
        try {
            decryptedPassword = decrypt(user.mailSetting.password);
        } catch {
            return NextResponse.json(
                { error: "Stored mail password could not be decrypted." },
                { status: 400 }
            );
        }
    }

    const rawMailSetting =
        typeof user.mailSetting.toObject === "function"
            ? user.mailSetting.toObject()
            : user.mailSetting;

    const mailSetting = {
        ...rawMailSetting,
        password: decryptedPassword,
    };

    return NextResponse.json({ mailSetting });
}

// POST method to update mail settings
export async function POST(req: NextRequest) {
    await connectToDatabase();
    // Get the user ID from the request
    const userId = getUserIdFromRequest(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse the request body to get the mailSetting
    const { mailSetting } = await req.json();
    const input = mailSetting as MailSettingInput | null;

    if (!input) {
        return NextResponse.json(
            { error: "Missing mailSetting" },
            { status: 400 }
        );
    }

    const type = String(input.type || "").trim().toLowerCase();
    const email = String(input.email || "").trim();
    const password = String(input.password || "");
    const host = String(input.host || "").trim();
    const name = String(input.name || "").trim();
    const secure = typeof input.secure === "boolean" ? input.secure : true;

    if (!isMailType(type)) {
        return NextResponse.json(
            { error: "Invalid mail service type" },
            { status: 400 }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json(
            { error: "Invalid email format" },
            { status: 400 }
        );
    }

    if (!password.trim()) {
        return NextResponse.json(
            { error: "Password is required" },
            { status: 400 }
        );
    }

    if (name.length > 100) {
        return NextResponse.json(
            { error: "Sender name cannot exceed 100 characters" },
            { status: 400 }
        );
    }

    let port: number | undefined;
    if (type === "smtp" || type === "custom") {
        if (!host) {
            return NextResponse.json(
                { error: "SMTP host is required for this service type" },
                { status: 400 }
            );
        }

        const parsedPort = parseInt(String(input.port || ""), 10);
        if (Number.isNaN(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
            return NextResponse.json(
                { error: "Port must be a number between 1 and 65535" },
                { status: 400 }
            );
        }
        port = parsedPort;
    }

    const nextMailSetting = {
        type,
        email,
        password: encrypt(password),
        host: type === "smtp" || type === "custom" ? host : "",
        port: type === "smtp" || type === "custom" ? port : undefined,
        secure,
        name,
    };

    // Update the user's mail settings
    const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { mailSetting: nextMailSetting } },
        { new: true, runValidators: true }
    );

    // If the user is not found, return a 404 error
    if (!updated)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Mail settings updated." });
}

export async function DELETE(req: NextRequest) {
    await connectToDatabase();

    const userId = getUserIdFromRequest(req);
    if (!userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { mailSetting: null } },
        { new: true, runValidators: true }
    );

    if (!updated)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Mail settings cleared." });
}