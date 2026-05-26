import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import type {
	EmailTemplate,
	EmailTemplateListQuery,
	EmailTemplateListResponse,
	UpdateEmailTemplateInput
} from "@/features/email-templates/types/email-template.types";

export async function listEmailTemplates(filters: EmailTemplateListQuery): Promise<EmailTemplateListResponse> {
	const params: Record<string, string | undefined> = {
		page: String(filters.page),
		pageSize: String(filters.pageSize),
		sort: filters.sort,
		dir: filters.dir
	};

	if (filters.search) params.search = filters.search;
	if (filters.isActive) params.isActive = filters.isActive;
	if (filters.fromDate) params.fromDate = filters.fromDate;
	if (filters.toDate) params.toDate = filters.toDate;

	return apiClient<EmailTemplateListResponse>({
		method: "GET",
		url: apiRoute.emailTemplates,
		params
	});
}

export async function getEmailTemplate(publicId: string): Promise<EmailTemplate> {
	return apiClient<EmailTemplate>({
		method: "GET",
		url: apiRoute.emailTemplate(publicId)
	});
}

export async function updateEmailTemplate({
	publicId,
	...data
}: UpdateEmailTemplateInput): Promise<EmailTemplate> {
	return apiClient<EmailTemplate>({
		method: "PATCH",
		url: apiRoute.emailTemplate(publicId),
		data
	});
}
