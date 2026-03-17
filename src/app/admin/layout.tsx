import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/Theme";
import AdminTopbar from "@/components/Navigation/Admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<AuthProvider>
				<AdminTopbar />
				{children}
			</AuthProvider>
		</ThemeProvider>
	);
}
