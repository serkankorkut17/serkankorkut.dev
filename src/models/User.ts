import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MailSettingSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["gmail", "outlook", "yahoo", "smtp", "custom"],
        },
        email: { type: String },
        password: { type: String },
        host: { type: String },
        port: { type: Number },
        secure: { type: Boolean, default: true },
        name: { type: String },
    },
    { _id: false }
);

const UserSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        avatar: { type: String },
        role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
        mailSetting: { type: MailSettingSchema, default: null },
    },
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);