"use server";

import { cookies } from "next/headers";

import { forwardCookies, serverApi } from "@/lib/server-api";

import { magicLinkRequestSchema } from "@/features/auth/login/validation/login-schema";
import { apiRoute, route } from "@/routes/routes";

const MAGIC_LINK_REDIRECT_COOKIE = "magic-link-redirect";
const MAGIC_LINK_REDIRECT_MAX_AGE_SECONDS = 10 * 60;

function getFrontendUrl(): URL | null {
	const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
	if (!frontendUrl) return null;

	try {
		return new URL(frontendUrl);
	} catch {
		return null;
	}
}

function resolveSafeRedirectUrl(redirectUrl: string | null): string | null {
	if (!redirectUrl) return null;

	const frontendUrl = getFrontendUrl();
	if (!frontendUrl) return null;

	try {
		const parsed = new URL(redirectUrl, frontendUrl);
		if (parsed.origin !== frontendUrl.origin) return null;
		return parsed.toString();
	} catch {
		return null;
	}
}

async function saveMagicLinkRedirect(redirectUrl: string | null) {
	const cookieStore = await cookies();
	const safeRedirectUrl = resolveSafeRedirectUrl(redirectUrl);

	if (!safeRedirectUrl) {
		cookieStore.delete(MAGIC_LINK_REDIRECT_COOKIE);
		return;
	}

	cookieStore.set(MAGIC_LINK_REDIRECT_COOKIE, safeRedirectUrl, {
		httpOnly: true,
		maxAge: MAGIC_LINK_REDIRECT_MAX_AGE_SECONDS,
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production"
	});
}

async function consumeMagicLinkRedirectWithPreferred(
	redirectUrl: string | null
): Promise<string> {
	const cookieStore = await cookies();
	const savedRedirect = cookieStore.get(MAGIC_LINK_REDIRECT_COOKIE)?.value ?? null;
	const safePreferredRedirectUrl = resolveSafeRedirectUrl(redirectUrl);
	const safeSavedRedirectUrl = resolveSafeRedirectUrl(savedRedirect);

	cookieStore.delete(MAGIC_LINK_REDIRECT_COOKIE);

	return safePreferredRedirectUrl ?? safeSavedRedirectUrl ?? route.private.dashboard;
}

export async function googleLogin(
	credential: string
): Promise<{ success: boolean; message: string }> {
	try {
		const { headers } = await serverApi<{ message: string; data: User }>({
			method: "POST",
			url: apiRoute.googleLogin,
			data: { credential }
		});

		await forwardCookies(headers["set-cookie"]);

		return { success: true, message: "Login successful" };
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "Google sign-in failed."
		};
	}
}

export async function requestMagicLink(
	email: string,
	redirectUrl: string | null
): Promise<{ success: boolean; message: string }> {
	const parsed = magicLinkRequestSchema.safeParse({ email });

	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? "Enter a valid email address."
		};
	}

	try {
		const safeRedirectUrl = resolveSafeRedirectUrl(redirectUrl);

		await saveMagicLinkRedirect(safeRedirectUrl);
		await serverApi<ApiResponse<null>>({
			method: "POST",
			url: apiRoute.magicLinkRequest,
			data: {
				email: parsed.data.email,
				...(safeRedirectUrl ? { redirectUrl: safeRedirectUrl } : {})
			}
		});

		return {
			success: true,
			message: "If the email exists, a magic link has been sent."
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "Could not send the magic link."
		};
	}
}

export async function verifyMagicLink(
	email: string,
	token: string,
	redirectUrl: string | null = null
): Promise<{ success: boolean; message: string; redirectUrl: string }> {
	try {
		const safeRedirectUrl = resolveSafeRedirectUrl(redirectUrl);
		const { headers } = await serverApi<{ message: string; data: User }>({
			method: "POST",
			url: apiRoute.magicLinkVerify,
			data: {
				email,
				token,
				...(safeRedirectUrl ? { redirectUrl: safeRedirectUrl } : {})
			}
		});

		await forwardCookies(headers["set-cookie"]);

		return {
			success: true,
			message: "Magic link verified successfully.",
			redirectUrl: await consumeMagicLinkRedirectWithPreferred(safeRedirectUrl)
		};
	} catch (error) {
		return {
			success: false,
			message: error instanceof Error ? error.message : "Magic link verification failed.",
			redirectUrl: route.private.dashboard
		};
	}
}
