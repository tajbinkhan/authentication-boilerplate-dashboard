import { useQuery } from "@tanstack/react-query";

import { listAuditLogs } from "@/features/audit-logs/actions/audit-logs.actions";
import { listSessions } from "@/features/sessions/actions/sessions.actions";

const dashboardStatsKey = ["dashboard", "stats"] as const;

export function useDashboardStats(enabled: boolean) {
	const sessionsQuery = useQuery({
		queryKey: [...dashboardStatsKey, "sessions"],
		queryFn: () =>
			listSessions({
				page: 1,
				pageSize: 1,
				sort: "createdAt",
				dir: "desc"
			}),
		enabled,
		staleTime: 30_000,
		retry: false
	});

	const auditLogsQuery = useQuery({
		queryKey: [...dashboardStatsKey, "audit-logs"],
		queryFn: () =>
			listAuditLogs({
				page: 1,
				pageSize: 1,
				sort: "createdAt",
				dir: "desc"
			}),
		enabled,
		staleTime: 30_000,
		retry: false
	});

	return {
		activeSessionCount: sessionsQuery.data?.total ?? null,
		recentAuditCount: auditLogsQuery.data?.total ?? null,
		isLoading: sessionsQuery.isLoading || auditLogsQuery.isLoading
	};
}
