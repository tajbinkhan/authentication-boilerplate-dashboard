import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import AuthProvider from "@/providers/auth-provider";
import { AppGoogleOAuthProvider } from "@/providers/google-oauth-provider";
import { ThemeProvider } from "@/providers/next-themes-provider";
import QueryProvider from "@/providers/query-provider";
import { RedirectProvider } from "@/providers/redirect-provider";
import { fetchUserFromApi } from "@/server/fetch-auth";
import type { Metadata } from "next";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: {
		default: "Next.js Dashboard",
		template: "%s | Next.js Dashboard"
	},
	description: "A boilerplate dashboard built with Next.js, React, and TypeScript."
};

// Cache user fetch per cookie string so repeated navigations
// within the same session hit the cache instead of the API
const getCachedUser = unstable_cache(
	async (cookieString: string) => {
		return fetchUserFromApi(cookieString);
	},
	["dashboard-user"],
	{ revalidate: 60, tags: ["user"] }
);

export default async function RootLayout({ children }: Readonly<GlobalLayoutProps>) {
	const cookieStore = await cookies();
	const cookieString = cookieStore.toString();
	const user = cookieString ? await getCachedUser(cookieString) : null;

	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				figtree.variable
			)}
			suppressHydrationWarning
		>
			<body className="flex min-h-full flex-col" suppressHydrationWarning>
				<NuqsAdapter>
					<AuthProvider user={user}>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<AppGoogleOAuthProvider>
								<QueryProvider>
									<RedirectProvider>
										<TooltipProvider>{children}</TooltipProvider>
										<Toaster richColors position="top-right" />
									</RedirectProvider>
								</QueryProvider>
							</AppGoogleOAuthProvider>
						</ThemeProvider>
					</AuthProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
