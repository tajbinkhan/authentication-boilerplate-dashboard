import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createSmtpProviderListQuery } from "@/features/smtp-providers/schemas/smtp-provider-api.schema";
import type {
	CreateSmtpProviderInput,
	SmtpProvider,
	SmtpProviderListQuery,
	SmtpProviderListResponse,
	TestConnectionResult,
	UpdateSmtpProviderInput
} from "@/features/smtp-providers/types/smtp-provider.types";

export async function listProviders(filters: SmtpProviderListQuery): Promise<SmtpProviderListResponse> {
	return apiClient<SmtpProviderListResponse>({
		method: "GET",
		url: apiRoute.smtpProviders,
		params: createSmtpProviderListQuery(filters)
	});
}

export async function getProvider(id: string): Promise<SmtpProvider> {
	return apiClient<SmtpProvider>({
		method: "GET",
		url: apiRoute.smtpProvider(id)
	});
}

export async function createProvider(data: CreateSmtpProviderInput): Promise<SmtpProvider> {
	return apiClient<SmtpProvider>({
		method: "POST",
		url: apiRoute.smtpProviders,
		data
	});
}

export async function updateProvider({ id, ...data }: UpdateSmtpProviderInput): Promise<SmtpProvider> {
	return apiClient<SmtpProvider>({
		method: "PATCH",
		url: apiRoute.smtpProvider(id),
		data
	});
}

export async function deleteProvider(id: string): Promise<{ deleted: boolean }> {
	return apiClient<{ deleted: boolean }>({
		method: "DELETE",
		url: apiRoute.smtpProvider(id)
	});
}

export async function testConnection(id: string): Promise<TestConnectionResult> {
	return apiClient<TestConnectionResult>({
		method: "POST",
		url: apiRoute.smtpProviderTest(id)
	});
}

export async function setDefault(id: string): Promise<SmtpProvider> {
	return apiClient<SmtpProvider>({
		method: "POST",
		url: apiRoute.smtpProviderSetDefault(id)
	});
}

export async function toggleProvider(id: string): Promise<SmtpProvider> {
	return apiClient<SmtpProvider>({
		method: "PATCH",
		url: apiRoute.smtpProviderToggle(id)
	});
}
