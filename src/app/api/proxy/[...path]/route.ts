import { NextRequest, NextResponse } from "next/server";

const NEST_API_URL = process.env.NEST_API_URL;

async function handler(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
	const { path } = await context.params;

	if (!NEST_API_URL) {
		return NextResponse.json({ message: "NEST_API_URL is not configured" }, { status: 500 });
	}

	const baseUrl = NEST_API_URL.endsWith("/") ? NEST_API_URL : `${NEST_API_URL}/`;
	const targetUrl = new URL(path.map(segment => encodeURIComponent(segment)).join("/"), baseUrl);
	targetUrl.search = req.nextUrl.search;
	const headers = new Headers(req.headers);

	headers.delete("host");
	headers.delete("connection");
	headers.delete("content-length");
	headers.delete("transfer-encoding");
	headers.delete("origin"); // ✅ Add this
	headers.delete("referer"); // ✅ Add this too

	const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.arrayBuffer();

	const backendRes = await fetch(targetUrl, {
		method: req.method,
		headers,
		body,
		cache: "no-store"
	});

	const responseHeaders = new Headers(backendRes.headers);

	responseHeaders.delete("connection");
	responseHeaders.delete("content-encoding");
	responseHeaders.delete("content-length");
	responseHeaders.delete("transfer-encoding");

	const response = new NextResponse(req.method === "HEAD" ? null : await backendRes.arrayBuffer(), {
		status: backendRes.status,
		headers: responseHeaders
	});

	return response;
}

export {
	handler as DELETE,
	handler as GET,
	handler as HEAD,
	handler as PATCH,
	handler as POST,
	handler as PUT
};

