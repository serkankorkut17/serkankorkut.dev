import jwt from "jsonwebtoken";
import { User } from "@/models/User";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

// Get the user ID from the JWT token stored in cookies
import { NextRequest } from "next/server";

export function getUserIdFromRequest(req: NextRequest) {
    try {
        const cookie = req.cookies.get("token")?.value;
        if (!cookie) return null;
        const decoded = jwt.verify(cookie, String(process.env.JWT_SECRET));
        
        if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
            return (decoded as jwt.JwtPayload).userId;
        }
        return null;
    } catch {
        return null;
    }
}

// Get the user's mail setting from the database using the user ID from the request
export function getUserMailSettingFromRequest(req: NextRequest) {
    const userId = getUserIdFromRequest(req);
    if (!userId) return null;

    return User.findById(userId).select("mailSetting").exec();
}