// import Google GenAI SDK
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const BEAUTIFY_PROMPT = `
Sen bir e-posta pazarlama ve kullanıcı deneyimi (UX) uzmanısın. Aşağıdaki brifi dikkate alarak, tam olarak belirtilen başlıklar ve alt başlıklarla yapılandırılmış, doğrudan kullanılabilecek bir e-posta şablonu tasarım rehberi hazırla. Lütfen yalnızca aşağıdaki başlıkları içeren bölümlerle ve hiçbir ekstra yorum veya metin olmadan yaz.
Brif:
1. Canlı renk paleti ve font önerileri
2. Kişiselleştirme ve resim urlleri için yer tutucular ({{firstName}}, {{userAge}}, {{logoUrl}} vs.)
3. Etkileşimli öğeler (buton, sosyal ikonlar, GIF/emoji kullanımı)
4. Konu satırı ve önizleme metni
5. Net bir harekete geçirici mesaj (CTA) cümlesi içermeli.
Kullanıcı promptu:
`;

// POST request handler for Gemini beautify prompt
export async function POST(req: NextRequest) {
    const { prompt } = await req.json();
    const fullPrompt = `${BEAUTIFY_PROMPT}\n${prompt}`;

    // Ensure the model environment variable is defined
    const model = process.env.GOOGLE_GENAI_MODEL;
    if (!model) {
        return new NextResponse(JSON.stringify({ error: "GOOGLE_GENAI_MODEL environment variable is not set" }), {
            status: 500,
        });
    }

    // Generate content using Google GenAI
    const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
    });

    // Get the beautified content from the response
    let beautified = "";
    try {
        const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error("No beautified text found");
        }
        beautified = text.trim();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return new NextResponse(JSON.stringify({ error: "Beautify failed" }), {
            status: 400,
        });
    }

    return new NextResponse(JSON.stringify({ prompt: beautified }), {
        status: 200,
    });
}