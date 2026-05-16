import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEFAULT_LOGIN_REDIRECT, apiRoute, route } from "@/routes/routes";

const AUTH_USER_HEADER = "x-auth-user";
const MAGIC_LINK_REDIRECT_COOKIE = "magic-link-redirect";

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

function createNextResponseWithUser(request: NextRequest, user: User) {
	const requestHeaders = new Headers(request.headers);
	requestHeaders.set(
		AUTH_USER_HEADER,
		Buffer.from(JSON.stringify(user), "utf8").toString("base64url")
	);

	return NextResponse.next({
		request: {
			headers: requestHeaders
		}
	});
}

async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
	if (!process.env.NEXT_PUBLIC_API_URL) {
		return null;
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiRoute.me}`, {
			method: "GET",
			headers: {
				accept: "application/json",
				authorization: request.headers.get("authorization") ?? "",
				cookie: request.headers.get("cookie") ?? ""
			},
			cache: "no-store"
		});

		if (!response.ok) {
			return null;
		}

		const payload = (await response.json()) as ApiResponse<User>;
		return payload.data ?? null;
	} catch {
		return null;
	}
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublicRoute = matchesAnyRoute(pathname, PUBLIC_ROUTES);
	const isPrivateRoute = matchesAnyRoute(pathname, PRIVATE_ROUTES);
	const isProtectedRoute = matchesAnyRoute(pathname, PROTECTED_ROUTES);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (!isPrivateRoute && !isProtectedRoute) {
		return NextResponse.next();
	}

	const authenticatedUser = await getAuthenticatedUser(request);
	const authenticated = Boolean(authenticatedUser);

	if (!authenticated && isPrivateRoute) {
		const loginUrl = new URL(route.protected.login, request.url);
		loginUrl.searchParams.set("redirect", request.nextUrl.href);

		return NextResponse.redirect(loginUrl);
	}

	if (authenticated && isProtectedRoute) {
		const response = NextResponse.redirect(resolvePostLoginRedirect(request));
		response.cookies.delete(MAGIC_LINK_REDIRECT_COOKIE);
		return response;
	}

	if (authenticatedUser) {
		return createNextResponseWithUser(request, authenticatedUser);
	}

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