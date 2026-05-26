import type { EmailLogListQuery } from "@/features/email-logs/types/email-log.types";

export const emailLogKeys = {
	all: ["email-logs"] as const,
	lists: () => [...emailLogKeys.all, "list"] as const,
	list: (filters: EmailLogListQuery) => [...emailLogKeys.lists(), filters] as const
};
