"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import MyToast from "@/components/Helpers/MyToast";
import Main from "@/components/Navigation/Email/Main";
import PageHeader from "@/components/Helpers/PageHeader";
import { FaEnvelope } from "react-icons/fa";
import LoggedInGuard from "@/components/Helpers/LoggedInGuard";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState<{ email?: string }>({});
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	// const router = useRouter();

	// Submit handler for the forgot password form
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setErrors({});

		try {
			const response = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error || "Failed to send password reset link"
				);
			}

			setMessage("If the email exists, a reset link has been sent.");
		} catch (error) {
			const errorMessage =
				error && typeof error === "object" && "message" in error
					? (error as { message: string }).message
					: "An unknown error occurred";
			setErrors({ email: errorMessage });
			setMessage(errorMessage);
		}
		setLoading(false);
	};

	return (
		<LoggedInGuard>
			<Main className="py-8 px-4 sm:px-8 mx-auto">
				<PageHeader
					icon={FaEnvelope}
					label="Forgot Password"
					title="Reset your password"
					subtitle="Enter your email to receive a password reset link."
					actionLink="/login"
					actionLabel="Back to login page"
				/>
				{/* Display any error or success messages */}
				{message && (
					<MyToast
						type={Object.keys(errors).length ? "error" : "success"}
						message={message}
						onClose={() => setMessage("")}
					/>
				)}
				{/* Email Input Form*/}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="email" className="mb-1 text-sm font-medium">
							Email
						</Label>
						<TextInput
							id="email"
							name="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							color={errors.email ? "failure" : "gray"}
							placeholder="Enter your email"
							className="w-full rounded-lg [&>input]:bg-gray-100 dark:[&>input]:bg-gray-800 [&>input]:text-gray-900 dark:[&>input]:text-gray-100"
						/>
						{errors.email && (
							<span className="text-red-500 text-sm">{errors.email}</span>
						)}
					</div>
					{/* Submit Button */}
					<div>
						<Button
							type="submit"
							color="primary"
							disabled={loading}
							className="w-full bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700"
						>
							{loading ? (
								<div className="flex items-center justify-center gap-2">
									<Spinner size="sm" />
									Sending...
								</div>
							) : (
								"Send Reset Link"
							)}
						</Button>
					</div>
				</form>
			</Main>
		</LoggedInGuard>
	);
}
