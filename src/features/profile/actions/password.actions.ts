"use server";

import { serverApi } from "@/lib/server-api";
import { apiRoute } from "@/routes/routes";
import { normalizeApiError } from "@/lib/api/errors";

export async function setPassword(
	password: string
): Promise<{ success: boolean; message: string }> {
	try {
		await serverApi({
			method: "POST",
			url: apiRoute.setPassword,
			data: { password }
		});

		return { success: true, message: "Password set successfully." };
	} catch (error) {
		return {
			success: false,
			message: normalizeApiError(error).message
		};
	}
}

export async function changePassword(
	currentPassword: string,
	newPassword: string
): Promise<{ success: boolean; message: string }> {
	try {
		await serverApi({
			method: "POST",
			url: apiRoute.changePassword,
			data: { currentPassword, newPassword }
		});

		return { success: true, message: "Password changed successfully." };
	} catch (error) {
		return {
			success: false,
			message: normalizeApiError(error).message
		};
	}
}
