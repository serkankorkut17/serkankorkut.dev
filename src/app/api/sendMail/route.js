import nodemailer from "nodemailer";
import { connectToDatabase } from "@/utils/database";
import { Template } from "@/models/Template";
import { Mailable } from "@/models/Mailable";

export async function POST(req) {
  try {
    await connectToDatabase();
    
    
    const body = await req.json();
    const { mailableId } = body;
    console.log(body);

    console.log("mailelableID: ", mailableId);

    // Mailable detaylarını al
    const mailable = await Mailable.findById(mailableId);
    if (!mailable) {
      console.log("mailable not found");
      return new Response(JSON.stringify({ error: "Mailable not found"  }), {
        status: 404,
      });
    }
    console.log("mailable: ", mailable);

    // Template detaylarını al
    const template = await Template.findById(mailable.templateId);
    if (!template) {
      console.log("template not found");
      return new Response(JSON.stringify({ error: "Template not found"  }), {
        status: 404,
      });
    }
    console.log("template: ", template);

    // Nodemailer transport oluştur
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmail hizmetini belirtin
      auth: {
        user: "gkblackfyre@gmail.com", // Gönderen e-posta adresi
        pass: "dasx vkmv oxct iktz", // Şifre veya uygulama şifresi
      },
    });

    // Mail seçenekleri
    const mailOptions = {
      from: "gkblackfyre@gmail.com", // Gönderen e-posta
      to: mailable.recipients.join(", "), // Alıcılar
      subject: mailable.subject, // Konu
      html: template.html, // HTML içeriği
      attachments: mailable.attachments?.map((file) => ({
        filename: file.name,
        content: Buffer.from(file.content, "base64"),
      })), // Ek dosyalar
    };

    // Mail gönderimi
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: "Mail sent successfully!"  }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to send mail", details: error.message  }), {
      status: 500,
    });
  }
}
