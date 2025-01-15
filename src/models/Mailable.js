import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MailableSchema = new Schema(
  {
    name: { type: String, required: true },
    recipients: { type: [String], required: true }, // E-posta adreslerini içeren bir dizi
    subject: { type: String, required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true }, // Template referansı
    attachments: { type: [String], default: [] }, // Dosya yolları veya base64 stringler
  },
  { timestamps: true }
);

export const Mailable = mongoose.models.Mailable || mongoose.model('Mailable', MailableSchema);
