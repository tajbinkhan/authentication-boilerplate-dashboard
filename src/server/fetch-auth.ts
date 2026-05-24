"use server";

import { cookies, headers } from "next/headers";

import { apiRoute } from "@/routes/routes";

const AUTH_USER_HEADER = "x-auth-user";

/**
 * Fetches the current user from the API using a raw cookie string.
 * Used by the root layout with unstable_cache to avoid per-navigation API calls.
 */
export async function fetchUserFromApi(cookieString: string): Promise<User | null> {
	if (!process.env.NEXT_PUBLIC_API_URL) {
		return null;
	}

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiRoute.me}`, {
			method: "GET",
			headers: {
				accept: "application/json",
				...(cookieString ? { cookie: cookieString } : {})
			},
			cache: "no-store"
		});

		if (!response.ok) {
			return null;
		}

		const userData = (await response.json()) as ApiResponse<User>;
		return userData.data;
	} catch {
		return null;
	}
}

export async function fetchAuth(): Promise<User | null | undefined> {
	if (!process.env.NEXT_PUBLIC_API_URL) {
		return null;
	}

	const cookieStore = await cookies();
	const cookieHeader = cookieStore.toString();

	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiRoute.me}`, {
			method: "GET",
			headers: {
				accept: "application/json",
				...(cookieHeader ? { cookie: cookieHeader } : {})
			},
			cache: "no-store"
		});

		if (!response.ok) {
			return null;
		}

		const userData = (await response.json()) as ApiResponse<User>;
		return userData.data;
	} catch {
		return null;
	}
}

export async function getUserFromRequestHeaders(): Promise<User | null> {
	const headerStore = await headers();
	const encodedUser = headerStore.get(AUTH_USER_HEADER);

	if (!encodedUser) {
		return null;
	}

	try {
		const parsed = JSON.parse(Buffer.from(encodedUser, "base64url").toString("utf8")) as User;
		return parsed;
	} catch {
		return null;
	}
}
