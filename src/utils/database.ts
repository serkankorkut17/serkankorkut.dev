import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable");
}

declare global {
    var _mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    } | undefined;
}

// güvenli şekilde global cache'i al / oluştur
const globalWithMongoose = global as typeof global & { _mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };

const cached = globalWithMongoose._mongoose ?? (globalWithMongoose._mongoose = { conn: null, promise: null });

export async function connectToDatabase(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
