"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, Loading03Icon, LockSync01Icon, Mail01Icon, MailSend01Icon, Tick02Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CredentialResponse, GoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import { FaGoogle } from "react-icons/fa";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema, magicLinkRequestSchema, type LoginSchema, type MagicLinkRequestSchema } from "@/features/auth/login/schemas/login-schema";
import { googleLogin, requestMagicLink } from "@/features/auth/login/actions/login";
import { passwordLogin } from "@/features/auth/login/actions/password-login";
import { getPublicSettings } from "@/features/system/actions/system.actions";
import type { PublicSystemSettings } from "@/features/system/types/system.types";
import useRedirect from "@/hooks/use-redirect";
import { route } from "@/routes/routes";

const DEFAULT_REDIRECT_URL = `${process.env.NEXT_PUBLIC_FRONTEND_URL}${route.private.dashboard}`;

const dashboardAccessRestrictionMessages = {
	account_pending_approval: "Your account is pending approval by an administrator.",
	dashboard_role_not_allowed: "Your role is not allowed to access the dashboard."
} as const;

type DashboardAccessRestrictionCode = keyof typeof dashboardAccessRestrictionMessages;

function isDashboardAccessRestrictionCode(
	value: string | null
): value is DashboardAccessRestrictionCode {
	return !!value && value in dashboardAccessRestrictionMessages;
}

function getDashboardAccessRestrictionMessage(errorCode: string | null): string | null {
	if (!isDashboardAccessRestrictionCode(errorCode)) return null;
	return dashboardAccessRestrictionMessages[errorCode];
}

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

type LoginMode = "password" | "magic-link";

export function LoginForm() {
	const { redirectUrl } = useRedirect();
	const [restrictionCode] = useQueryState("error", { parse: value => value ?? null });
	const dashboardAccessRestrictionMessage =
		getDashboardAccessRestrictionMessage(restrictionCode);
	const [loginMode, setLoginMode] = useState<LoginMode>("password");
	const [isRequestingMagicLink, setIsRequestingMagicLink] = useState(false);
	const [magicLinkMessage, setMagicLinkMessage] = useState<string | null>(null);
	const [magicLinkErrorMessage, setMagicLinkErrorMessage] = useState<string | null>(null);
	const [isLoggingInWithGoogle, setIsLoggingInWithGoogle] = useState(false);
	const [googleErrorMessage, setGoogleErrorMessage] = useState<string | null>(null);
	const [isLoggingInWithPassword, setIsLoggingInWithPassword] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);
	const [publicSettings, setPublicSettings] = useState<PublicSystemSettings | null>(null);

	useEffect(() => {
		getPublicSettings()
			.then(settings => {
				setPublicSettings(settings);
			})
			.catch(err => {
				console.error("Failed to load public system settings", err);
			});
	}, []);

	const {
		register: registerMagicLink,
		handleSubmit: handleSubmitMagicLink,
		formState: { errors: magicLinkErrors }
	} = useForm<MagicLinkRequestSchema>({
		resolver: zodResolver(magicLinkRequestSchema),
		defaultValues: { email: "" }
	});

	const {
		register: registerPassword,
		handleSubmit: handleSubmitPassword,
		formState: { errors: passwordErrors }
	} = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" }
	});

	const handleMagicLinkSubmit = async (values: MagicLinkRequestSchema) => {
		setIsRequestingMagicLink(true);
		setMagicLinkMessage(null);
		setMagicLinkErrorMessage(null);

		try {
			const result = await requestMagicLink(values.email, redirectUrl);
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

	const handlePasswordSubmit = async (values: LoginSchema) => {
		setIsLoggingInWithPassword(true);
		setPasswordErrorMessage(null);

		try {
			const result = await passwordLogin(values.email, values.password);
			if (!result.success) throw new Error(result.message || "Login failed.");
			window.location.assign(resolveSafeRedirectUrl(redirectUrl));
		} catch (error) {
			setPasswordErrorMessage(
				error instanceof Error ? error.message : "Login failed. Please try again."
			);
		} finally {
			setIsLoggingInWithPassword(false);
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
			{publicSettings?.accessModel === "CLOSED" && (
				<Alert className="border-amber-500/20 bg-amber-500/5 text-amber-600 dark:border-amber-500/30 dark:text-amber-400 rounded-xl mb-4">
					<HugeiconsIcon icon={AlertCircleIcon} className="size-4 text-amber-600 dark:text-amber-400" />
					<AlertTitle className="font-semibold text-sm">Private System</AlertTitle>
					<AlertDescription className="text-xs">
						Self-registration is closed. Only pre-authorized accounts can sign in.
					</AlertDescription>
				</Alert>
			)}

			{dashboardAccessRestrictionMessage && (
				<Alert variant="destructive" className="rounded-xl mb-4">
					<HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
					<AlertTitle className="font-semibold text-sm">Access restricted</AlertTitle>
					<AlertDescription className="text-xs">
						{dashboardAccessRestrictionMessage}
					</AlertDescription>
				</Alert>
			)}

			<div className="flex gap-2 mb-4">
				<Button
					type="button"
					variant={loginMode === "password" ? "default" : "outline"}
					className="flex-1 rounded-xl"
					onClick={() => setLoginMode("password")}
				>
					<HugeiconsIcon icon={LockSync01Icon} className="size-4 mr-2" />
					Password
				</Button>
				<Button
					type="button"
					variant={loginMode === "magic-link" ? "default" : "outline"}
					className="flex-1 rounded-xl"
					onClick={() => setLoginMode("magic-link")}
				>
					<HugeiconsIcon icon={MailSend01Icon} className="size-4 mr-2" />
					Magic Link
				</Button>
			</div>

			{loginMode === "password" && (
				<form className="space-y-4" onSubmit={handleSubmitPassword(handlePasswordSubmit)} noValidate>
					<Field>
						<FieldLabel htmlFor="password-email">Email address</FieldLabel>
						<FieldContent>
							<div className="relative">
								<HugeiconsIcon
									icon={Mail01Icon}
									className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
								/>
								<Input
									id="password-email"
									type="email"
									{...registerPassword("email")}
									placeholder="you@example.com"
									autoComplete="email"
									className="h-12 rounded-xl pl-10"
									disabled={isLoggingInWithPassword}
								/>
							</div>
							<FieldError>{passwordErrors.email?.message}</FieldError>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<FieldContent>
							<div className="relative">
								<HugeiconsIcon
									icon={LockSync01Icon}
									className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
								/>
								<Input
									id="password"
									type="password"
									{...registerPassword("password")}
									placeholder="Enter your password"
									autoComplete="current-password"
									className="h-12 rounded-xl pl-10"
									disabled={isLoggingInWithPassword}
								/>
							</div>
							<FieldError>{passwordErrors.password?.message}</FieldError>
						</FieldContent>
					</Field>

					<Button
						type="submit"
						className="h-12 w-full justify-center gap-3 rounded-xl px-4"
						disabled={isLoggingInWithPassword || isLoggingInWithGoogle}
					>
						{isLoggingInWithPassword ? (
							<>
								<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
								<span className="text-sm font-semibold">Signing in...</span>
							</>
						) : (
							<>
								<HugeiconsIcon icon={UserCircleIcon} className="size-4" />
								<span className="text-sm font-semibold">Sign in with password</span>
							</>
						)}
					</Button>
				</form>
			)}

			{loginMode === "magic-link" && (
				<form className="space-y-4" onSubmit={handleSubmitMagicLink(handleMagicLinkSubmit)} noValidate>
					<Field>
						<FieldLabel htmlFor="magic-link-email">Email address</FieldLabel>
						<FieldContent>
							<div className="relative">
								<HugeiconsIcon
									icon={Mail01Icon}
									className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
								/>
								<Input
									id="magic-link-email"
									type="email"
									{...registerMagicLink("email")}
									placeholder="you@example.com"
									autoComplete="email"
									className="h-12 rounded-xl pl-10"
									disabled={isRequestingMagicLink}
								/>
							</div>
							<FieldError>{magicLinkErrors.email?.message}</FieldError>
						</FieldContent>
					</Field>

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
			)}

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

			{passwordErrorMessage && (
				<p className="text-destructive text-center text-sm" role="alert">
					{passwordErrorMessage}
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
							disabled={isLoggingInWithGoogle || isRequestingMagicLink || isLoggingInWithPassword}
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

						{!isLoggingInWithGoogle && !isRequestingMagicLink && !isLoggingInWithPassword && (
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
					Secure authentication powered by password, magic links, and Google
				</p>
			</div>
		</>
	);
}

