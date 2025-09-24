import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { firstName, lastName, username, email, password, confirmPassword } = await req.json();

        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (password !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
        });
        await user.save();

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}