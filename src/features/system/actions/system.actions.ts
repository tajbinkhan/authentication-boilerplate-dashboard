import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import type {
	PublicSystemSettings,
	SystemSettings,
	UpdateSystemSettingsInput
} from "../types/system.types";

export async function getPublicSettings(): Promise<PublicSystemSettings> {
	return apiClient<PublicSystemSettings>({
		method: "GET",
		url: apiRoute.systemSettingsPublic
	});
}

export async function getSettings(): Promise<SystemSettings> {
	return apiClient<SystemSettings>({
		method: "GET",
		url: apiRoute.systemSettings
	});
}

export async function updateSettings(data: UpdateSystemSettingsInput): Promise<SystemSettings> {
	return apiClient<SystemSettings>({
		method: "PATCH",
		url: apiRoute.systemSettings,
		data
	});
}
