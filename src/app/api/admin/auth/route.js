import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(request) {
	try {
		const { password } = await request.json();

		// Environment variables'ları kontrol et
		const adminPassword = process.env.ADMIN_PASSWORD;
		const cookieName = process.env.PASSWORD_COOKIE_NAME || "admin-auth";

		if (!adminPassword) {
			console.error("ADMIN_PASSWORD environment variable is not set");
			return NextResponse.json(
				{ error: "Server configuration error" },
				{ status: 500 }
			);
		}
		// Şifreyi kontrol et
		if (password !== adminPassword) {

			// Brute force saldırıları önlemek için küçük bir gecikme
			await new Promise((resolve) => setTimeout(resolve, 1000));

			return NextResponse.json(
				{ error: "Incorrect password" },
				{ status: 401 }
			);
		}

		// Güvenli cookie oluştur
		const cookie = serialize(cookieName, "true", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24, // 24 saat
		});

		return NextResponse.json(
			{ message: "Login successful" },
			{
				status: 200,
				headers: {
					"Set-Cookie": cookie,
				},
			}
		);
	} catch (error) {
		console.error("Admin login error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// Logout endpoint
export async function DELETE(request) {
	const cookieName = process.env.PASSWORD_COOKIE_NAME || "admin-auth";

	const cookie = serialize(cookieName, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 0, // Hemen sil
	});

	return NextResponse.json(
		{ message: "Logout successful" },
		{
			status: 200,
			headers: {
				"Set-Cookie": cookie,
			},
		}
	);
}
