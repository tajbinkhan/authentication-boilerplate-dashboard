import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOGIN_REDIRECT, apiRoute, route } from "@/routes/routes";

const AUTH_COOKIE_NAME = "access-token";
const REQUIRES_2FA_COOKIE = "requires-2fa";
const MAGIC_LINK_REDIRECT_COOKIE = "magic-link-redirect";

async function validateSession(accessToken: string): Promise<boolean> {
	const nestApiUrl = process.env.NEST_API_URL;
	if (!nestApiUrl) return true;

	try {
		const baseUrl = nestApiUrl.endsWith("/") ? nestApiUrl : `${nestApiUrl}/`;
		const response = await fetch(new URL(apiRoute.me, baseUrl), {
			method: "GET",
			headers: {
				accept: "application/json",
				cookie: `${AUTH_COOKIE_NAME}=${accessToken}`
			},
			cache: "no-store"
		});

		return response.ok;
	} catch {
		return true;
	}
}

const PUBLIC_ROUTES = Object.values(route.public) as string[];
const PRIVATE_ROUTES = Object.values(route.private) as string[];
const PROTECTED_ROUTES = Object.values(route.protected) as string[];

function isRouteMatch(pathname: string, routePath: string): boolean {
	if (routePath === route.private.dashboard) {
		return pathname === route.private.dashboard;
	}

	return pathname === routePath || pathname.startsWith(`${routePath}/`);
}

function matchesAnyRoute(pathname: string, routes: string[]): boolean {
	return routes.some(routePath => isRouteMatch(pathname, routePath));
}

function resolveSafeRedirect(request: NextRequest, redirectUrl: string | undefined | null): URL | null {
	if (!redirectUrl) return null;

	try {
		const parsed = new URL(redirectUrl, request.url);
		if (parsed.origin !== request.nextUrl.origin) return null;
		return parsed;
	} catch {
		return null;
	}
}

function resolvePostLoginRedirect(request: NextRequest): URL {
	const redirectParam = request.nextUrl.searchParams.get("redirect");
	const savedMagicLinkRedirect = request.cookies.get(MAGIC_LINK_REDIRECT_COOKIE)?.value;

	return (
		resolveSafeRedirect(request, redirectParam) ??
		resolveSafeRedirect(request, savedMagicLinkRedirect) ??
		new URL(DEFAULT_LOGIN_REDIRECT, request.url)
	);
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublicRoute = matchesAnyRoute(pathname, PUBLIC_ROUTES);
	const isPrivateRoute = matchesAnyRoute(pathname, PRIVATE_ROUTES);
	const isProtectedRoute = matchesAnyRoute(pathname, PROTECTED_ROUTES);
	const isTwoFactorVerifyRoute = isRouteMatch(pathname, route.protected.twoFactorVerify);

	// Public routes bypass auth checks entirely
	if (isPublicRoute) {
		return NextResponse.next();
	}

	// Unknown routes (e.g. _next, static files) pass through
	if (!isPrivateRoute && !isProtectedRoute) {
		return NextResponse.next();
	}

	const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);
	const requires2fa = Boolean(request.cookies.get(REQUIRES_2FA_COOKIE)?.value);

	// No auth cookie → unauthenticated
	if (!hasAuthCookie) {
		if (isPrivateRoute) {
			const loginUrl = new URL(route.protected.login, request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.href);

			// Forward error params if present (e.g. from access restriction)
			const error = request.nextUrl.searchParams.get("error");
			const message = request.nextUrl.searchParams.get("message");
			if (error) loginUrl.searchParams.set("error", error);
			if (message) loginUrl.searchParams.set("message", message);

			return NextResponse.redirect(loginUrl);
		}

		// Not on a protected route either — just pass through
		return NextResponse.next();
	}

	// Has auth cookie but needs 2FA
	if (requires2fa) {
		if (!isTwoFactorVerifyRoute) {
			const verifyUrl = new URL(route.protected.twoFactorVerify, request.url);
			verifyUrl.searchParams.set("redirect", request.nextUrl.href);
			return NextResponse.redirect(verifyUrl);
		}

		// On 2FA verify route — let through
		return NextResponse.next();
	}

	// Validate the session token before granting access to private routes
	if (isPrivateRoute) {
		const accessToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
		if (!accessToken || !(await validateSession(accessToken))) {
			const loginUrl = new URL(route.protected.login, request.url);
			loginUrl.searchParams.set("redirect", request.nextUrl.href);

			const response = NextResponse.redirect(loginUrl);
			response.cookies.delete(AUTH_COOKIE_NAME);
			response.cookies.delete(REQUIRES_2FA_COOKIE);
			return response;
		}
	}

	// Authenticated user trying to access login/signup → redirect to dashboard
	if (isProtectedRoute) {
		const response = NextResponse.redirect(resolvePostLoginRedirect(request));
		response.cookies.delete(MAGIC_LINK_REDIRECT_COOKIE);
		return response;
	}

	// Authenticated user accessing private route — let through
	// User data will be fetched once by the layout and cached
	return NextResponse.next();
}

export const config = {
	matcher: [
		{
			source: "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
			missing: [
				{ type: "header", key: "next-router-prefetch" },
				{ type: "header", key: "purpose", value: "prefetch" }
			]
		}
	]
};
