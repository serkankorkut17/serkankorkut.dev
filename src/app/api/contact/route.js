import nodemailer from "nodemailer";
import EmailData from "@/data/email.json";

const { EMAIL_USER, EMAIL_PASS, EMAIL_TO } = EmailData;

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, phone, message } = body;

    // Create a transporter object with your email service configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use any email service provider
      auth: {
        user: EMAIL_USER, // Your email address
        pass: EMAIL_PASS, // Your email password or app password
      },
    });

    // Email options
    const mailOptions = {
      from: email, // The sender's email address
      to: EMAIL_TO, // Your email address to receive the form data
      subject: `New Message from ${name}: ${subject}`,
      text: `
        You have received a new message from serkankorkut.dev contact form:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    return new Response(JSON.stringify({ message: "Form submitted successfully!" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ message: "Failed to send email." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
