import nodemailer from "nodemailer";


export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, phone, message } = body;

    // Create a transporter object with your email service configuration
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use any email service provider
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: email, // The sender's email address
      to: process.env.EMAIL_TO || process.env.GMAIL_USER, // The recipient's email address
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
