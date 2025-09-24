import { NextResponse } from "next/server";
import { connectToDatabase } from "@/utils/database";
import { NextRequest } from "next/server";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
	try {
		await connectToDatabase();
		const { email } = await req.json();

		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ message: "If the email exists, a reset link has been sent." },
				{ status: 200 }
			);
		}

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT_SECRET environment variable is not defined");
		}
    
		const resetToken = jwt.sign(
			{ userId: user._id, type: "passwordReset" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		});

		const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

		await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to: user.email,
			subject: "Password Reset",
			html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
		});

		return NextResponse.json(
			{ message: "If the email exists, a reset link has been sent." },
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
