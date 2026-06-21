import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contact-schema";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

// Best-effort, in-memory rate limit. Resets on cold start / per instance —
// fine as a light abuse brake for a portfolio contact form, not a hard guarantee.
const hits = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now > rec.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (rec.count >= MAX_REQUESTS) return true;
  hits.set(ip, { ...rec, count: rec.count + 1 });
  return false;
}

export async function POST(request: Request) {
  const { GMAIL_USER, GMAIL_PASS, EMAIL_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_PASS || !EMAIL_TO) {
    console.error("[contact] missing GMAIL_USER / GMAIL_PASS / EMAIL_TO");
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ success: false, error: "rate" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "company" field — silently accept and drop.
  if (
    body &&
    typeof body === "object" &&
    "company" in body &&
    (body as Record<string, unknown>).company
  ) {
    return Response.json({ success: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ success: false, error: "invalid" }, { status: 400 });
  }

  // name is CR/LF-stripped by the schema transform, so it is safe in headers.
  const { name, email, message } = parsed.data;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    });
    await transporter.sendMail({
      from: `Portfolio Contact <${GMAIL_USER}>`,
      to: EMAIL_TO,
      replyTo: email,
      subject: `Portfolio contact — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return Response.json({ success: true });
  } catch (err) {
    console.error("[contact] sendMail failed", err);
    return Response.json({ success: false, error: "server" }, { status: 502 });
  }
}
