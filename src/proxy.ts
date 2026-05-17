import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiErrorPayload } from "@/lib/api/errors";
import { DEFAULT_LOGIN_REDIRECT, apiRoute, route } from "@/routes/routes";

const AUTH_USER_HEADER = "x-auth-user";
const MAGIC_LINK_REDIRECT_COOKIE = "magic-link-redirect";

const PUBLIC_ROUTES = Object.values(route.public) as string[];
const PRIVATE_ROUTES = Object.values(route.private) as string[];
const PROTECTED_ROUTES = Object.values(route.protected) as string[];

type AuthState =
	| { status: "authenticated"; user: User }
	| { status: "requires_2fa" }
	| { status: "unauthenticated" };

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

async function getAuthState(request: NextRequest): Promise<AuthState> {
	if (!process.env.NEXT_PUBLIC_API_URL) {
		return { status: "unauthenticated" };
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
			const payload = (await response.json().catch(() => null)) as
				| ApiErrorPayload
				| null;

			if (response.status === 401 && payload?.code === "two_factor_required") {
				return { status: "requires_2fa" };
			}

			return { status: "unauthenticated" };
		}

		const payload = (await response.json()) as ApiResponse<User>;
		return payload.data
			? { status: "authenticated", user: payload.data }
			: { status: "unauthenticated" };
	} catch {
		return { status: "unauthenticated" };
	}
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const isPublicRoute = matchesAnyRoute(pathname, PUBLIC_ROUTES);
	const isPrivateRoute = matchesAnyRoute(pathname, PRIVATE_ROUTES);
	const isProtectedRoute = matchesAnyRoute(pathname, PROTECTED_ROUTES);
	const isTwoFactorVerifyRoute = isRouteMatch(pathname, route.protected.twoFactorVerify);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (!isPrivateRoute && !isProtectedRoute) {
		return NextResponse.next();
	}

	const authState = await getAuthState(request);

	if (authState.status === "unauthenticated" && isPrivateRoute) {
		const loginUrl = new URL(route.protected.login, request.url);
		loginUrl.searchParams.set("redirect", request.nextUrl.href);

		return NextResponse.redirect(loginUrl);
	}

	if (authState.status === "requires_2fa" && !isTwoFactorVerifyRoute) {
		const verifyUrl = new URL(route.protected.twoFactorVerify, request.url);
		verifyUrl.searchParams.set("redirect", request.nextUrl.href);

		return NextResponse.redirect(verifyUrl);
	}

	if (authState.status === "requires_2fa" && isTwoFactorVerifyRoute) {
		return NextResponse.next();
	}

	if (authState.status === "authenticated" && isProtectedRoute) {
		const response = NextResponse.redirect(resolvePostLoginRedirect(request));
		response.cookies.delete(MAGIC_LINK_REDIRECT_COOKIE);
		return response;
	}

	if (authState.status === "authenticated") {
		return createNextResponseWithUser(request, authState.user);
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
