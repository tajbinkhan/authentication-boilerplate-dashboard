"use client";

import { AlertCircleIcon, CheckmarkCircle02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

import { verifyMagicLink } from "@/features/auth/login/actions/login";
import { route } from "@/routes/routes";

type VerifyStatus = "verifying" | "success" | "error";

interface MagicLinkVerifyClientProps {
	email: string | null;
	token: string | null;
	redirectUrl: string | null;
}

function getInitialStatus(email: string | null, token: string | null): VerifyStatus {
	return email && token ? "verifying" : "error";
}

function getInitialMessage(email: string | null, token: string | null): string {
	return email && token
		? "Verifying your magic link..."
		: "This magic link is missing required verification details.";
}

export function MagicLinkVerifyClient({ email, token, redirectUrl }: MagicLinkVerifyClientProps) {
	const hasStarted = useRef(false);
	const [status, setStatus] = useState<VerifyStatus>(() => getInitialStatus(email, token));
	const [message, setMessage] = useState(() => getInitialMessage(email, token));

	useEffect(() => {
		if (hasStarted.current || !email || !token) return;
		hasStarted.current = true;

		verifyMagicLink(email, token, redirectUrl)
			.then(result => {
				if (!result.success) {
					if (result.redirectUrl) {
						window.location.replace(result.redirectUrl);
						return;
					}

					setStatus("error");
					setMessage(result.message || "Magic link verification failed.");
					return;
				}

				setStatus("success");
				setMessage("You are signed in. Redirecting...");
				window.location.replace(result.redirectUrl ?? route.private.dashboard);
			})
			.catch(() => {
				setStatus("error");
				setMessage("Magic link verification failed.");
			});
	}, [email, redirectUrl, token]);

	const icon =
		status === "success" ? CheckmarkCircle02Icon : status === "error" ? AlertCircleIcon : Loading03Icon;

	return (
		<main className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
			<div className="border-border/50 bg-background/85 w-full max-w-md space-y-5 rounded-3xl border p-8 text-center shadow-2xl shadow-black/8 backdrop-blur-xl dark:shadow-black/30">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted/30">
					<HugeiconsIcon
						icon={icon}
						className={status === "verifying" ? "size-6 animate-spin" : "size-6"}
					/>
				</div>

				<div className="space-y-2">
					<h1 className="text-foreground text-2xl font-bold tracking-tight">
						{status === "error" ? "Magic link could not be verified" : "Checking your magic link"}
					</h1>
					<p className="text-muted-foreground text-sm leading-6">{message}</p>
				</div>

				{status === "error" && (
					<Button asChild className="h-11 w-full rounded-xl">
						<Link href={route.protected.login}>Back to login</Link>
					</Button>
				)}
			</div>
		</main>
	);
}
