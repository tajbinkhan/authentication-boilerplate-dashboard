import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL;
const AUTH_COOKIE_NAME = "better-auth.session_token";
const CSRF_COOKIE_NAME = "csrf-token";

const HOP_BY_HOP_REQUEST_HEADERS = new Set([
	"connection",
	"content-length",
	"cookie",
	"host",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);

const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
	"access-control-allow-credentials",
	"access-control-allow-headers",
	"access-control-allow-methods",
	"access-control-allow-origin",
	"access-control-expose-headers",
	"access-control-max-age",
	"connection",
	"content-encoding",
	"content-length",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);

function createCookieHeader(req: NextRequest): string | undefined {
	const cookies: string[] = [];
	const sessionToken = req.cookies.get(AUTH_COOKIE_NAME)?.value;
	const csrfToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;

	if (sessionToken) {
		cookies.push(`${AUTH_COOKIE_NAME}=${sessionToken}`);
	}

	if (csrfToken) {
		cookies.push(`${CSRF_COOKIE_NAME}=${csrfToken}`);
	}

	return cookies.length > 0 ? cookies.join("; ") : undefined;
}

function createRequestHeaders(req: NextRequest): Headers {
	const headers = new Headers();

	req.headers.forEach((value, key) => {
		const normalizedKey = key.toLowerCase();
		if (HOP_BY_HOP_REQUEST_HEADERS.has(normalizedKey)) return;
		if (normalizedKey === "origin" || normalizedKey === "referer") return;
		headers.set(key, value);
	});

	const cookieHeader = createCookieHeader(req);
	if (cookieHeader) {
		headers.set("cookie", cookieHeader);
	}

	return headers;
}

function createResponseHeaders(backendRes: Response): Headers {
	const headers = new Headers();

	backendRes.headers.forEach((value, key) => {
		const normalizedKey = key.toLowerCase();
		if (HOP_BY_HOP_RESPONSE_HEADERS.has(normalizedKey)) return;
		if (normalizedKey === "set-cookie") return;
		headers.set(key, value);
	});

	return headers;
}

async function handler(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
	const { path } = await context.params;

	if (!NEST_API_URL) {
		return NextResponse.json({ message: "NEST_API_URL is not configured" }, { status: 500 });
	}

	const baseUrl = NEST_API_URL.endsWith("/") ? NEST_API_URL : `${NEST_API_URL}/`;
	const targetUrl = new URL(path.map(segment => encodeURIComponent(segment)).join("/"), baseUrl);
	targetUrl.search = req.nextUrl.search;

	const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();

	const backendRes = await fetch(targetUrl, {
		method: req.method,
		headers: createRequestHeaders(req),
		body,
		cache: "no-store"
	});

	const responseHeaders = createResponseHeaders(backendRes);

	const setCookieHeaders = backendRes.headers.getSetCookie();
	if (setCookieHeaders.length > 0) {
		responseHeaders.delete("set-cookie");

		for (const cookieStr of setCookieHeaders) {
			const [nameValue, ...attributes] = cookieStr.split(";");
			const sanitizedAttributes = attributes
				.map(attr => attr.trim())
				.filter(attr => !attr.toLowerCase().startsWith("domain"));

			responseHeaders.append("set-cookie", [nameValue, ...sanitizedAttributes].join("; "));
		}
	}

	return new NextResponse(req.method === "HEAD" ? null : await backendRes.arrayBuffer(), {
		status: backendRes.status,
		headers: responseHeaders
	});
}

export {
	handler as DELETE,
	handler as GET,
	handler as HEAD,
	handler as PATCH,
	handler as POST,
	handler as PUT
};
