import type { UserRole } from "@/features/users/types/users.types";

export const auditLogActionValues = [
	"USER_CREATED",
	"USER_PROVISIONED",
	"USER_UPDATED",
	"ROLE_UPDATED",
	"USER_DELETED",
	"USER_SESSIONS_REVOKED",
	"2FA_ENABLED",
	"2FA_DISABLED",
	"2FA_RESET",
	"LOGIN_SUCCESS"
] as const;

export const auditLogTargetTypeValues = ["user"] as const;

export const auditLogSortValues = [
	"action",
	"actorRole",
	"targetType",
	"targetId",
	"createdAt",
	"updatedAt"
] as const;

export const auditLogSortDirectionValues = ["asc", "desc"] as const;

export type AuditLogAction = (typeof auditLogActionValues)[number];
export type AuditLogTargetType = (typeof auditLogTargetTypeValues)[number];
export type AuditLogSort = (typeof auditLogSortValues)[number];
export type AuditLogSortDirection = (typeof auditLogSortDirectionValues)[number];

export interface AuditLog {
	id: string;
	actorId: string | null;
	actorRole: UserRole | null;
	actorName: string | null;
	actorEmail: string | null;
	action: AuditLogAction | string;
	targetType: AuditLogTargetType | string;
	targetId: string;
	metadata: Record<string, unknown>;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: string;
	updatedAt: string;
}

export type AuditLogListResponse = PaginatedData<AuditLog>;

export interface AuditLogFilterOptions {
	actions: string[];
	targetTypes: string[];
}

export interface AuditLogListQuery {
	page: number;
	pageSize: number;
	actorId?: string;
	actor?: string;
	action?: AuditLogAction | string;
	targetType?: AuditLogTargetType | string;
	fromDate?: string;
	toDate?: string;
	sort: AuditLogSort;
	dir: AuditLogSortDirection;
}
