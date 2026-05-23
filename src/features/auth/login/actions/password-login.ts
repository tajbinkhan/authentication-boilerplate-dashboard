"use server";

import { loginSchema } from "@/features/auth/login/schemas/login-schema";
import { normalizeApiError } from "@/lib/api/errors";
import { forwardCookies, serverApi } from "@/lib/server-api";
import { apiRoute } from "@/routes/routes";

export async function passwordLogin(
	email: string,
	password: string
): Promise<{ success: boolean; message: string }> {
	const parsed = loginSchema.safeParse({ email, password });

	if (!parsed.success) {
		return {
			success: false,
			message: parsed.error.issues[0]?.message ?? "Invalid credentials."
		};
	}

	try {
		const { headers } = await serverApi<{ message: string; data: User }>({
			method: "POST",
			url: apiRoute.passwordLogin,
			data: { email: parsed.data.email, password: parsed.data.password }
		});

		await forwardCookies(headers["set-cookie"]);

		return { success: true, message: "Login successful" };
	} catch (error) {
		return {
			success: false,
			message: normalizeApiError(error).message
		};
	}
}


