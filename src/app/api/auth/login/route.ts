import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { email, password, rememberMe } = await req.json();

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			);
		}

		if (!process.env.JWT_SECRET) {
			console.error("JWT_SECRET is not defined in environment variables.");
			return NextResponse.json(
				{ error: "Server misconfiguration" },
				{ status: 500 }
			);
		}

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		const cookieOptions: {
			httpOnly: boolean;
			secure: boolean;
			sameSite: "strict" | "lax" | "none";
			path: string;
			maxAge?: number;
		} = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			// sameSite: "strict",
			sameSite: "lax",
			path: "/",
		};
		if (rememberMe) {
			cookieOptions.maxAge = 30 * 24 * 60 * 60; // 30 days
		}

		const response = NextResponse.json({
			message: "Login successful",
			user: {
				id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			},
		});
		response.cookies.set("token", token, cookieOptions);
		return response;
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
