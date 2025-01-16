import nodemailer from "nodemailer";
import { connectToDatabase } from "@/utils/database";
import { Template } from "@/models/Template";
import { Mailable } from "@/models/Mailable";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { mailableId } = body;

    // Get mailable details
    const mailable = await Mailable.findById(mailableId);
    if (!mailable) {
      return new Response(JSON.stringify({ error: "Mailable not found" }), {
        status: 404,
      });
    }

    // Get template details
    const template = await Template.findById(mailable.templateId);
    if (!template) {
      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: 404,
      });
    }

    // Create a transporter object with your email service configuration
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: mailable.recipients.join(", "),
      subject: mailable.subject,
      html: template.html, // HTML template
      attachments: mailable.attachments?.map((file) => ({
        filename: file.name,
        content: Buffer.from(file.content, "base64"),
      })), // Attachments
    };

    await transporter.sendMail(mailOptions);
    return new Response(
      JSON.stringify({ message: "Mail sent successfully!" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to send mail", details: error.message }),
      {
        status: 500,
      }
    );
  }
}
