import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
    try {
        await connectToDatabase();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        let decoded: string | jwt.JwtPayload;
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { error: "JWT secret not configured" },
                { status: 500 }
            );
        }
        try {
            decoded = jwt.verify(token, jwtSecret);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            if (err.name === "TokenExpiredError") {
                return NextResponse.json(
                    { error: "Token expired" },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded)
        ) {
            return NextResponse.json(
                { error: "Invalid token payload" },
                { status: 401 }
            );
        }

        const user = await User.findById((decoded as jwt.JwtPayload).userId).select("-password");
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}