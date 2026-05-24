import Link from "next/link";

import { Button } from "@/components/ui/button";
import { route } from "@/routes/routes";

export function MagicLinkSuccessClient() {
	return (
		<main className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
			<div className="border-border/50 bg-background/85 w-full max-w-md space-y-5 rounded-3xl border p-8 text-center shadow-2xl shadow-black/8 backdrop-blur-xl dark:shadow-black/30">
				<div className="space-y-2">
					<h1 className="text-foreground text-2xl font-bold tracking-tight">
						Magic link could not be verified
					</h1>
					<p className="text-muted-foreground text-sm leading-6">
						The link may have expired or already been used. Request a fresh sign-in link to
						continue.
					</p>
				</div>
				<Button asChild className="h-11 w-full rounded-xl">
					<Link href={route.protected.login}>Back to login</Link>
				</Button>
			</div>
		</main>
	);
}
