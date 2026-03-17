"use client";

import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";
import AuthContext from "@/contexts/AuthContext";

export default function AdminTopbar() {
	const auth = useContext(AuthContext);
	const user = auth?.user;
	const logout = auth?.logout;
	const router = useRouter();

	return (
		<header className="sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur">
			<div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<Link href="/admin/maps" className="text-lg font-bold text-orange-500">
						Admin Panel
					</Link>
					<nav className="hidden sm:flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
						<Link href="/admin/maps" className="hover:text-orange-500 transition-colors">Maps</Link>
						<Link href="/admin/nades" className="hover:text-orange-500 transition-colors">Nades</Link>
					</nav>
				</div>

				<div className="flex items-center gap-2">
					{user ? (
						<>
							<span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400">
								{user.email}
							</span>
							<Button
								color="light"
								onClick={async () => {
									if (logout) {
										await logout();
										return;
									}
									router.push("/login");
								}}
							>
								Logout
							</Button>
						</>
					) : (
						<Button color="light" onClick={() => router.push("/login")}>
							Login
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
