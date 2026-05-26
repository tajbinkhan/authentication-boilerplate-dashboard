import { useQuery } from "@tanstack/react-query";

import { getEmailTemplate, listEmailTemplates } from "./email-template.actions";
import { emailTemplateKeys } from "./email-template.keys";
import type { EmailTemplateListQuery } from "@/features/email-templates/types/email-template.types";

export function useEmailTemplatesQuery(filters: EmailTemplateListQuery) {
	return useQuery({
		queryKey: emailTemplateKeys.list(filters),
		queryFn: () => listEmailTemplates(filters)
	});
}

export function useEmailTemplateQuery(publicId: string) {
	return useQuery({
		queryKey: emailTemplateKeys.detail(publicId),
		queryFn: () => getEmailTemplate(publicId),
		enabled: !!publicId
	});
}
