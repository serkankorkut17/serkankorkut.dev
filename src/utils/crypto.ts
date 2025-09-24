import crypto from "crypto";

const algorithm = "aes-256-cbc";
if (!process.env.CRYPTO_SECRET) {
	throw new Error("CRYPTO_SECRET environment variable is not defined");
}
if (!process.env.CRYPTO_IV) {
	throw new Error("CRYPTO_IV environment variable is not defined");
}
const key = Buffer.from(process.env.CRYPTO_SECRET, "hex"); // 32 byte
const iv = Buffer.from(process.env.CRYPTO_IV, "hex"); // 16 byte

export function encrypt(text: string) {
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(text, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
}

export function decrypt(encrypted: string) {
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encrypted, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}
