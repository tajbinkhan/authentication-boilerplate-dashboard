export type SessionStatus = "active" | "revoked" | "expired";
export const sessionStatusValues = ["active", "revoked", "expired"] as const;
export const sessionSortValues = [
	"deviceName",
	"deviceType",
	"ipAddress",
	"userAgent",
	"status",
	"createdAt",
	"expiresAt"
] as const;
export const sessionSortDirectionValues = ["asc", "desc"] as const;

export interface Session {
	id: string;
	deviceName: string;
	deviceType: string;
	ipAddress: string;
	userAgent: string;
	status: SessionStatus;
	isCurrent: boolean;
	isRevoked: boolean;
	twoFactorVerified: boolean;
	createdAt: string;
	updatedAt: string;
	expiresAt: string;
}

export type SessionSort = (typeof sessionSortValues)[number];
export type SessionSortDirection = (typeof sessionSortDirectionValues)[number];
export type SessionListResponse = PaginatedData<Session> & {
	activeOtherSessionCount: number;
};

export interface SessionListQuery {
	page: number;
	pageSize: number;
	search?: string;
	status?: string;
	deviceType?: string;
	fromDate?: string;
	toDate?: string;
	sort: SessionSort;
	dir: SessionSortDirection;
}

export interface RevokeOtherSessionsResponse {
	revokedCount: number;
}
