import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    await connectToDatabase();
    const { username } = await params;

    // Authenticate the user
    const userId = getUserIdFromRequest(req);

    // Get the user with the given username
    const user = await User.findOne({ username }).select(
        "username email firstName lastName createdAt updatedAt mailSetting _id"
    );

    // If the user is not found, return a 404 error
    if (!user)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

    // If the userId is provided, check if it matches the user's ID
    if (!userId || user._id.toString() !== userId.toString())
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Return the user details
    return NextResponse.json({
        username: user.username,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        mailSetting: user.mailSetting || null,
    });
}