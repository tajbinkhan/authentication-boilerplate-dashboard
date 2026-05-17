"use client";

import { Loading03Icon, Mail01Icon, MailSend01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CredentialResponse, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { SyntheticEvent, useState } from "react";
import { FaGoogle } from "react-icons/fa";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { googleLogin, requestMagicLink } from "@/features/auth/login/actions/login";
import useRedirect from "@/hooks/use-redirect";
import { route } from "@/routes/routes";

const DEFAULT_REDIRECT_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${route.private.dashboard}`;

function resolveSafeRedirectUrl(redirectUrl: string | null): string {
	if (!redirectUrl) return DEFAULT_REDIRECT_URL;
	try {
		const frontendUrl = new URL(process.env.NEXT_PUBLIC_FRONTEND_URL!);
		const parsed = new URL(redirectUrl, frontendUrl);
		if (parsed.origin !== frontendUrl.origin) return DEFAULT_REDIRECT_URL;
		return parsed.toString();
	} catch {
		return DEFAULT_REDIRECT_URL;
	}
}

export function LoginForm() {
	const { redirectUrl } = useRedirect();
	const [email, setEmail] = useState("");
	const [isRequestingMagicLink, setIsRequestingMagicLink] = useState(false);
	const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null);
	const [magicLinkErrorMessage, setMagicLinkErrorMessage] = useState<string | null>(null);
	const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);
	const [googleErrorMessage, setGoogleErrorMessage] = useState<string | null>(null);

	const handleMagicLinkSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsRequestingMagicLink(true);
		setMagicLinkMessage(null);
		setMagicLinkErrorMessage(null);

		try {
			const result = await requestMagicLink(email, redirectUrl);
			if (!result.success) throw new Error(result.message || "Could not send the magic link.");
			setMagicLinkMessage("Check your email for a sign-in link.");
		} catch (error) {
			setMagicLinkErrorMessage(
				error instanceof Error ? error.message : "Could not send the magic link."
			);
		} finally {
			setIsRequestingMagicLink(false);
		}
	};

	const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
		const credential = credentialResponse.credential;
		if (!credential) {
			setGoogleErrorMessage("Google did not return a login credential. Please try again.");
			return;
		}

		setIsLoggingInWithGoogle(true);
		setGoogleErrorMessage(null);

		try {
			const result = await googleLogin(credential);
			if (!result.success)
				throw new Error(result.message || "Google sign-in failed. Please try again.");
			window.location.assign(resolveSafeRedirectUrl(redirectUrl));
		} catch (error) {
			setGoogleErrorMessage(
				error instanceof Error ? error.message : "Google sign-in failed. Please try again."
			);
			setIsLoggingInWithGoogle(false);
		}
	};

	const handleGoogleError = () => {
		setGoogleErrorMessage("Google sign-in was cancelled or could not be completed.");
		setIsLoggingInWithGoogle(false);
	};

	useGoogleOneTapLogin({
		onSuccess: handleGoogleSuccess,
		onError: handleGoogleError,
		cancel_on_tap_outside: false,
		use_fedcm_for_prompt: false
	});

	return (
		<>
			<form className="space-y-4" onSubmit={handleMagicLinkSubmit} noValidate>
				<div className="space-y-2">
					<label htmlFor="magic-link-email" className="text-foreground text-sm font-medium">
						Email address
					</label>
					<div className="relative">
						<HugeiconsIcon
							icon={Mail01Icon}
							className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
						/>
						<Input
							id="magic-link-email"
							type="email"
							name="email"
							value={email}
							onChange={event => setEmail(event.target.value)}
							placeholder="you@example.com"
							autoComplete="email"
							className="h-12 rounded-xl pl-10"
							disabled={isRequestingMagicLink}
							aria-invalid={Boolean(magicLinkErrorMessage)}
						/>
					</div>
				</div>

				<Button
					type="submit"
					className="h-12 w-full justify-center gap-3 rounded-xl px-4"
					disabled={isRequestingMagicLink || isLoggingInWithGoogle}
				>
					{isRequestingMagicLink ? (
						<>
							<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
							<span className="text-sm font-semibold">Sending link...</span>
						</>
					) : (
						<>
							<HugeiconsIcon icon={MailSend01Icon} className="size-4" />
							<span className="text-sm font-semibold">Send magic link</span>
						</>
					)}
				</Button>
			</form>

			{magicLinkMessage && (
				<Alert className="border-primary/20 bg-primary/5 text-primary">
					<HugeiconsIcon icon={Tick02Icon} className="size-4" />
					<AlertTitle>Magic link sent</AlertTitle>
					<AlertDescription className="text-primary/80">{magicLinkMessage}</AlertDescription>
				</Alert>
			)}

			{magicLinkErrorMessage && (
				<p className="text-destructive text-center text-sm" role="alert">
					{magicLinkErrorMessage}
				</p>
			)}

			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="bg-border w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background text-muted-foreground px-3 font-medium">
						Or continue with
					</span>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex min-h-11 w-full items-center justify-center">
					<div className="relative h-12 w-full">
						<Button
							type="button"
							disabled={isLoggingInWithGoogle || isRequestingMagicLink}
							className="pointer-events-none h-12 w-full justify-center gap-3 rounded-xl px-4"
						>
							{isLoggingInWithGoogle ? (
								<>
									<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
									<span className="text-sm font-semibold">Signing you in...</span>
								</>
							) : (
								<>
									<FaGoogle className="size-5" />
									<span className="text-sm font-semibold">Continue with Google</span>
								</>
							)}
						</Button>

						{!isLoggingInWithGoogle && !isRequestingMagicLink && (
							<div className="absolute inset-0 overflow-hidden rounded-xl opacity-0">
								<GoogleLogin
									onSuccess={handleGoogleSuccess}
									onError={handleGoogleError}
									text="signin_with"
									theme="outline"
									size="large"
									shape="rectangular"
									width="390"
									use_fedcm_for_button={false}
									use_fedcm_for_prompt={false}
								/>
							</div>
						)}
					</div>
				</div>

				{googleErrorMessage && (
					<p className="text-destructive text-center text-sm" role="alert">
						{googleErrorMessage}
					</p>
				)}

				<p className="text-muted-foreground text-center text-xs">
					Secure authentication powered by magic links and Google
				</p>
			</div>
		</>
	);
}
