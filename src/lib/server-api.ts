import axios, { AxiosRequestConfig, AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";
import { wrapper } from "axios-cookiejar-support";
import { cookies, headers } from "next/headers";
import { parse } from "set-cookie-parser";
import { CookieJar } from "tough-cookie";

import { apiRoute } from "@/routes/routes";

const CSRF_COOKIE_NAME = "csrf-token";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const FORWARDED_REQUEST_HEADERS = [
	"user-agent",
	"x-forwarded-for",
	"x-real-ip",
	"sec-ch-ua",
	"sec-ch-ua-mobile",
	"sec-ch-ua-platform"
] as const;

export function createServerClient() {
	// Scoped per-call: cookies set by CSRF response are automatically
	// included in subsequent requests within the same client instance
	const jar = new CookieJar();

	const client = wrapper(
		axios.create({
			baseURL: BASE_URL,
			withCredentials: true,
			jar,
			headers: { "ngrok-skip-browser-warning": "true" }
		})
	);

	return client;
}

export async function forwardCookies(setCookieHeader: string | string[] | undefined) {
	if (!setCookieHeader) return;

	const cookieStore = await cookies();
	const parsed = parse(Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader], {
		decodeValues: false
	});

	for (const { name, value, httpOnly, secure, sameSite, maxAge, path } of parsed) {
		cookieStore.set(name, value, {
			httpOnly,
			secure,
			sameSite: sameSite as "strict" | "lax" | "none" | undefined,
			maxAge,
			path
		});
	}
}

export async function serverApi<T = unknown>(
	config: AxiosRequestConfig
): Promise<{ data: T; headers: RawAxiosResponseHeaders | AxiosResponseHeaders }> {
	const client = createServerClient();
	const isMutating = config.method?.toLowerCase() !== "get";
	const forwardedHeaders = await getForwardedRequestHeaders();

	// Seed the jar with existing browser cookies so the API
	// server sees the user's session on every call
	const cookieStore = await cookies();
	const existingCookies = cookieStore.getAll();
	for (const { name, value } of existingCookies) {
		await client.defaults.jar!.setCookie(`${name}=${value}`, BASE_URL);
	}

	const getCSRFToken = async (): Promise<string> => {
		const cached = cookieStore.get(CSRF_COOKIE_NAME)?.value;
		if (cached) return cached;

		const { data, headers } = await client.get(apiRoute.csrf);
		await forwardCookies(headers["set-cookie"]);
		return data.data;
	};

	const run = async (token?: string) => {
		const response = await client({
			...config,
			headers: {
				...forwardedHeaders,
				...config.headers,
				...(isMutating && token ? { "X-CSRF-Token": token } : {})
			}
		});
		return { data: response.data as T, headers: response.headers };
	};

	if (!isMutating) return run();

	const token = await getCSRFToken();

	try {
		return await run(token);
	} catch (error) {
		if (axios.isAxiosError(error) && error.response?.status === 403) {
			// Force-refresh: clear cached token and re-fetch
			cookieStore.delete(CSRF_COOKIE_NAME);
			const { data, headers } = await client.get(apiRoute.csrf);
			await forwardCookies(headers["set-cookie"]);
			return await run(data.data);
		}
		throw error;
	}
}

async function getForwardedRequestHeaders(): Promise<Record<string, string>> {
	const requestHeaders = await headers();
	const forwardedHeaders: Record<string, string> = {};

	for (const header of FORWARDED_REQUEST_HEADERS) {
		const value = requestHeaders.get(header);
		if (value) forwardedHeaders[header] = value;
	}

	if (forwardedHeaders["user-agent"]) {
		forwardedHeaders["x-client-user-agent"] = forwardedHeaders["user-agent"];
	}

	return forwardedHeaders;
}
