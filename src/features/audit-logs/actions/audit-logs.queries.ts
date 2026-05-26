import { useQuery } from "@tanstack/react-query";

import { getAuditLogFilterOptions, listAuditLogs } from "./audit-logs.actions";
import { auditLogKeys } from "./audit-logs.keys";
import type { AuditLogListQuery } from "@/features/audit-logs/types/audit-logs.types";

export function useAuditLogsQuery(filters: AuditLogListQuery) {
	return useQuery({
		queryKey: auditLogKeys.list(filters),
		queryFn: () => listAuditLogs(filters)
	});
}

export function useAuditLogFilterOptions() {
	return useQuery({
		queryKey: auditLogKeys.filterOptions(),
		queryFn: () => getAuditLogFilterOptions(),
		staleTime: Infinity
	});
}
