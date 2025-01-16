import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MailableSchema = new Schema(
  {
    name: { type: String, required: true },
    recipients: { type: [String], required: true },
    subject: { type: String, required: true },
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    attachments: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Mailable = mongoose.models.Mailable || mongoose.model('Mailable', MailableSchema);
