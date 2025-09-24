import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MailSentSchema = new Schema(
    {
        userId: { type: String, required: true },
        receivers: [
            {
                email: { type: String, required: true },
                name: { type: String, required: true },
                status: {
                    type: String,
                    enum: ["sending", "sent", "failed", "opened"],
                    default: "sending",
                },
                openedAt: { type: Date, default: null },
                sentAt: { type: Date, default: null },
            },
        ],
        subject: { type: String, required: true },
        body: { type: String, required: true },
        attachments: { type: [String], default: [] },
    },
    { timestamps: true }
);
export const MailSent =
    mongoose.models.MailSent || mongoose.model("MailSent", MailSentSchema);