import type { EmailTemplateListQuery } from "@/features/email-templates/types/email-template.types";

export const emailTemplateKeys = {
	all: ["email-templates"] as const,
	lists: () => [...emailTemplateKeys.all, "list"] as const,
	list: (filters: EmailTemplateListQuery) => [...emailTemplateKeys.lists(), filters] as const
};
