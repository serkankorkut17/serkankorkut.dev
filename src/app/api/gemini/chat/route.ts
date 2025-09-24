// import Google GenAI SDK
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
	apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// POST request handler for Gemini chat
export async function POST(req: NextRequest) {
	const { prompt } = await req.json();

	try {
		// generate content using Google GenAI
		const response = await ai.models.generateContent({
			model:
				process.env.GOOGLE_GENAI_MODEL ??
				(() => {
					throw new Error(
						"GOOGLE_GENAI_MODEL environment variable is not set."
					);
				})(),
			contents: prompt,
		});

		// Get the answer from the response
		let answer = "";
		try {
			answer =
				response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
		} catch (e) {
			return new NextResponse(JSON.stringify({ error: "No response received." }), {
				status: 400,
			});
		}

		return new NextResponse(JSON.stringify({ answer }), { status: 200 });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred.";
		return new NextResponse(JSON.stringify({ error: errorMessage }), {
			status: 500,
		});
	}
}
