import type { SmtpProviderListQuery } from "@/features/smtp-providers/types/smtp-provider.types";

export const smtpProviderKeys = {
	all: ["smtp-providers"] as const,
	lists: () => [...smtpProviderKeys.all, "list"] as const,
	list: (filters: SmtpProviderListQuery) => [...smtpProviderKeys.lists(), filters] as const
};
