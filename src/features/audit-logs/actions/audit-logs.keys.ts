import type { AuditLogListQuery } from "@/features/audit-logs/types/audit-logs.types";

export const auditLogKeys = {
	all: ["audit-logs"] as const,
	lists: () => [...auditLogKeys.all, "list"] as const,
	list: (filters: AuditLogListQuery) => [...auditLogKeys.lists(), filters] as const,
	filterOptions: () => [...auditLogKeys.all, "filter-options"] as const
};
