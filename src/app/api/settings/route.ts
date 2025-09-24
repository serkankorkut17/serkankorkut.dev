import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import { encrypt, decrypt } from "@/utils/crypto";

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

    // Decrypt the mailSetting if it exists
    if (user.mailSetting) {
        user.mailSetting = {
            ...user.mailSetting,
            password: decrypt(user.mailSetting.password),
        };
    }

    return NextResponse.json({ mailSetting: user.mailSetting });
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

    // if (!mailSetting)
    //     return NextResponse.json(
    //         { error: "Missing mailSetting" },
    //         { status: 400 }
    //     );

    // encrypt the password in mailSetting
    if (mailSetting && mailSetting.password) {
        mailSetting.password = encrypt(mailSetting.password);
    } else {
        return NextResponse.json(
            { error: "Missing mailSetting or password" },
            { status: 400 }
        );
    }

    // Update the user's mail settings
    const updated = await User.findByIdAndUpdate(
        userId,
        { $set: { mailSetting } },
        { new: true, runValidators: true }
    );

    // If the user is not found, return a 404 error
    if (!updated)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Mail settings updated." });
}