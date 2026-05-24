"use client";

import { AlertCircleIcon, LockSync01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { SetPasswordForm } from "@/features/profile/components/set-password-form";
import { usePasswordForm } from "@/features/profile/hooks/use-password-form";
import { route } from "@/routes/routes";

export function PasswordCard() {
	const form = usePasswordForm();

	if (!form.user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>Sign in to manage your password.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (!form.user.is2faEnabled && !form.hasPassword) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>
						Enable two-factor authentication before setting a password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert className="border-amber-500/20 bg-amber-500/5 text-amber-600 dark:border-amber-500/30 dark:text-amber-400">
						<HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
						<AlertTitle className="text-sm font-semibold">2FA Required</AlertTitle>
						<AlertDescription className="text-xs">
							You must enable two-factor authentication before you can set a password.{" "}
							<a href={route.private.profile} className="font-medium underline">
								Go to security settings
							</a>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>
					{form.hasPassword ? "Change your password" : "Set a password for your account"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{form.message && (
					<Alert className="border-primary/20 bg-primary/5 text-primary">
						<HugeiconsIcon icon={Tick02Icon} className="size-4" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>{form.message}</AlertDescription>
					</Alert>
				)}

				{form.error && (
					<Alert variant="destructive">
						<HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{form.error}</AlertDescription>
					</Alert>
				)}

				{!form.hasPassword && form.mode !== "set" && form.mode !== "change" && (
					<Button onClick={() => form.setMode("set")} className="rounded-xl">
						<HugeiconsIcon icon={LockSync01Icon} className="size-4" />
						Set Password
					</Button>
				)}

				{form.hasPassword && form.mode !== "set" && form.mode !== "change" && (
					<Button onClick={() => form.setMode("change")} className="rounded-xl">
						<HugeiconsIcon icon={LockSync01Icon} className="size-4" />
						Change Password
					</Button>
				)}

				{form.mode === "set" && <SetPasswordForm form={form} />}
				{form.mode === "change" && <ChangePasswordForm form={form} />}
			</CardContent>
		</Card>
	);
}
