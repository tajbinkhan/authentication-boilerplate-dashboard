"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon, LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useVerifyTwoFactorMutation } from "@/features/auth/two-factor/actions/two-factor.mutations";
import {
	twoFactorCodeFormSchema,
	type TwoFactorCodeFormValues
} from "@/features/auth/two-factor/schemas/two-factor.schema";
import axiosClientApi from "@/lib/client-api";
import { apiRoute, route } from "@/routes/routes";

interface TwoFactorVerifyClientProps {
	redirectUrl: string | null;
}

const defaultRedirectUrl = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${route.private.dashboard}`;

export function TwoFactorVerifyClient({ redirectUrl }: TwoFactorVerifyClientProps) {
	const verifyTwoFactorMutation = useVerifyTwoFactorMutation();

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<TwoFactorCodeFormValues>({
		resolver: zodResolver(twoFactorCodeFormSchema),
		defaultValues: { code: "" }
	});

	const onSubmit = (values: TwoFactorCodeFormValues) => {
		verifyTwoFactorMutation.mutate(
			{ code: values.code },
			{
				onSuccess: () => {
					window.location.replace(resolveSafeRedirectUrl(redirectUrl));
				}
			}
		);
	};

	const handleLogout = async () => {
		try {
			await axiosClientApi.post(apiRoute.logout);
			window.location.href = route.protected.login;
		} catch {
			toast.error("Failed to sign out");
		}
	};

	return (
		<main className="from-background via-background to-muted/20 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
			<div className="border-border/50 bg-background/85 w-full max-w-md space-y-5 rounded-3xl border p-8 text-center shadow-2xl shadow-black/8 backdrop-blur-xl dark:shadow-black/30">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full border bg-muted/30">
					<HugeiconsIcon icon={LockKeyIcon} className="size-6" />
				</div>

				<div className="space-y-2">
					<h1 className="text-foreground text-2xl font-bold tracking-tight">
						Two-factor verification
					</h1>
					<p className="text-muted-foreground text-sm leading-6">
						Enter a code from your authenticator app or one of your recovery codes.
					</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<Field>
						<FieldLabel htmlFor="two-factor-verify-code">Code</FieldLabel>
						<Input
							id="two-factor-verify-code"
							{...register("code")}
							placeholder="123456 or ABCDE-F1234"
							autoComplete="one-time-code"
							disabled={verifyTwoFactorMutation.isPending}
							className="h-12 rounded-xl text-center tracking-widest"
						/>
					</Field>
					<Button
						type="submit"
						className="h-11 w-full rounded-xl"
						disabled={verifyTwoFactorMutation.isPending}
					>
						{verifyTwoFactorMutation.isPending ? (
							<>
								<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
								Verifying
							</>
						) : (
							"Verify"
						)}
					</Button>
				</form>

				{verifyTwoFactorMutation.error ? (
					<Alert variant="destructive">
						<AlertTitle>Verification failed</AlertTitle>
						<AlertDescription>{verifyTwoFactorMutation.error.message}</AlertDescription>
					</Alert>
				) : null}

				<Button type="button" variant="ghost" className="w-full" onClick={handleLogout}>
					Sign out
				</Button>
			</div>
		</main>
	);
}

function resolveSafeRedirectUrl(redirectUrl: string | null): string {
	if (!redirectUrl) return defaultRedirectUrl;

	try {
		const frontendUrl = new URL(process.env.NEXT_PUBLIC_FRONTEND_URL!);
		const parsed = new URL(redirectUrl, frontendUrl);

		if (parsed.origin !== frontendUrl.origin) return defaultRedirectUrl;

		return parsed.toString();
	} catch {
		return defaultRedirectUrl;
	}
}
