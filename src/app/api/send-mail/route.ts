import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/utils/database";
import { Template } from "@/models/Template";
import { MailList } from "@/models/MailList";
import { MailSent } from "@/models/MailSent";
import { User } from "@/models/User";
import { getUserIdFromRequest } from "@/utils/auth";
import { decrypt } from "@/utils/crypto";

// POST method to send an email using a template and mail list
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // Find the user
        const userId = getUserIdFromRequest(req);

        // Get the user's mail settings
        let userMailSetting = null;
        if (userId) {
            const user = await User.findById(userId).select("mailSetting");
            if (
                user &&
                user.mailSetting &&
                user.mailSetting.email &&
                user.mailSetting.password
            ) {
                userMailSetting = user.mailSetting;
                // Decrypt the password
                userMailSetting.password = decrypt(userMailSetting.password);
            }
        }

        // Get the form data from the request
        const formData = await req.formData();
        const subjectEntry = formData.get("subject");
        const subject = typeof subjectEntry === "string" ? subjectEntry : undefined;
        const templateId = formData.get("templateId");
        const mailListId = formData.get("mailListId");
        const variables = JSON.parse(String(formData.get("variables") || "{}"));

        // Attachments
        const attachments = [];
        for (const entry of formData.getAll("attachments")) {
            if (entry instanceof File) {
                const arrayBuffer = await entry.arrayBuffer();
                attachments.push({
                    filename: entry.name,
                    content: Buffer.from(arrayBuffer),
                });
            }
        }

        // receive template
        const template = await Template.findById(templateId);
        if (!template) {
            return NextResponse.json(
                { error: "Template not found" },
                { status: 404 }
            );
        }
        // receive mail list
        const mailList = await MailList.findById(mailListId);
        if (!mailList) {
            return NextResponse.json(
                { error: "Mail list not found" },
                { status: 404 }
            );
        }

        // Fill the template with variables
        let html = template.html;
        for (const [key, value] of Object.entries(variables)) {
            html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
        }

        // Filter subscribers and prepare the receivers array
        const receivers = (mailList.emails as Array<{ email: string; name: string; subscriptionStatus: string }>)
            .filter((e) => e.subscriptionStatus === "subscribed")
            .map((e) => ({
                email: e.email.trim(),
                name: e.name,
                status: "sending",
                sentAt: null,
                openedAt: null,
            }));

        // Create a new MailSent document
        const mailSent = await MailSent.create({
            userId,
            receivers,
            subject,
            body: html,
            attachments: attachments.map((a) => a.filename),
        });

        // Dynamic transporter settings
        let transporter;
        if (userMailSetting) {
            // Transporter with user mail settings
            if (
                userMailSetting.type === "gmail" ||
                userMailSetting.type === "outlook" ||
                userMailSetting.type === "yahoo"
            ) {
                transporter = nodemailer.createTransport({
                    service: userMailSetting.type,
                    auth: {
                        user: userMailSetting.email,
                        pass: userMailSetting.password,
                    },
                });
            } else {
                const parsedPort = parseInt(
                    String(userMailSetting.port || ""),
                    10
                );
                if (
                    !userMailSetting.host ||
                    Number.isNaN(parsedPort) ||
                    parsedPort < 1 ||
                    parsedPort > 65535
                ) {
                    return NextResponse.json(
                        { error: "Invalid SMTP host or port" },
                        { status: 400 }
                    );
                }

                transporter = nodemailer.createTransport({
                    host: userMailSetting.host,
                    port: parsedPort,
                    secure: userMailSetting.secure,
                    auth: {
                        user: userMailSetting.email,
                        pass: userMailSetting.password,
                    },
                });
            }
        } else {
            // If no user mail settings, use default Gmail settings
            transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS,
                },
            });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        // send mail to each receiver
        for (const receiver of mailSent.receivers) {
            try {
                // Add a tracking pixel for each recipient
                const trackingPixel = `<img src="${baseUrl}/api/mail-open?mailSentId=${
                    mailSent._id
                }&email=${encodeURIComponent(
                    receiver.email
                )}" width="1" height="1" style="display:none;" alt="" />`;

                // If </body> tag exists, insert before it
                let htmlWithPixel;
                if (html.includes("</body>")) {
                    htmlWithPixel = html.replace(
                        /<\/body>/i,
                        `${trackingPixel}</body>`
                    );
                } else {
                    // If not, append to the end
                    htmlWithPixel = html + trackingPixel;
                }
                // console.log(htmlWithPixel);

                // Send mail
                await transporter.sendMail({
                    from: userMailSetting
                        ? userMailSetting.name
                            ? `"${userMailSetting.name}" <${userMailSetting.email}>`
                            : userMailSetting.email
                        : process.env.GMAIL_USER,
                    to: receiver.email,
                    subject,
                    html: htmlWithPixel,
                    attachments,
                });

                // If sending is successful, update the status
                receiver.status = "sent";
                receiver.sentAt = new Date();
            } catch (error) {
                console.error(
                    `Failed to send mail to ${receiver.email}:`,
                    error
                );
                receiver.status = "failed";
            }
        }
        // Update the MailSent document
        await mailSent.save();

        // Send mail
        // await transporter.sendMail({
        //     from: process.env.GMAIL_USER,
        //     to: mailList.emails
        //         .filter((e) => e.subscriptionStatus === "subscribed")
        //         .map((e) => e.email.trim())
        //         .join(","),
        //     subject,
        //     html,
        //     attachments,
        // });

        return NextResponse.json(
            { message: "Mail sent successfully!", mailSentId: mailSent._id },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { 
                error: "Failed to send mail", 
                details: typeof error === "object" && error !== null && "message" in error ? (error as { message: string }).message : String(error)
            },
            { status: 500 }
        );
    }
}