import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { token, password, confirmPassword } = await req.json();

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        let decoded;
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json({ error: "JWT secret is not configured" }, { status: 500 });
        }
        try {
            decoded = jwt.verify(token, jwtSecret);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            (decoded as { type?: string }).type !== "passwordReset"
        ) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}