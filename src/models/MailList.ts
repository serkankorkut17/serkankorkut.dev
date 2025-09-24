import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MailListSchema = new Schema(
    {
        userId: { type: String, required: true },
        listName: { type: String, required: true },
        emails: [
            {
                email: { type: String, required: true },
                name: { type: String, required: true },
                subscriptionStatus: {
                    type: String,
                    enum: ["subscribed", "unsubscribed"],
                    default: "subscribed",
                },
            },
        ],
    },
    { timestamps: true }
);
export const MailList =
    mongoose.models.MailList || mongoose.model("MailList", MailListSchema);