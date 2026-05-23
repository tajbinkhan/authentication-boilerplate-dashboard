import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createAuditLogListQuery } from "@/features/audit-logs/schemas/audit-logs-api.schema";
import type {
	AuditLogListQuery,
	AuditLogListResponse
} from "@/features/audit-logs/types/audit-logs.types";

export async function listAuditLogs(
	filters: AuditLogListQuery
): Promise<AuditLogListResponse> {
	return apiClient<AuditLogListResponse>({
		method: "GET",
		url: apiRoute.auditLogs,
		params: createAuditLogListQuery(filters)
	});
}
