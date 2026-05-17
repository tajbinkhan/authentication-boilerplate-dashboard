export type UserRole = "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
export const userRoleValues = ["ADMIN", "MANAGER", "USER", "SUPER_ADMIN"] as const;
export const userSortValues = [
	"name",
	"email",
	"emailVerified",
	"is2faEnabled",
	"role",
	"activeSessionCount",
	"createdAt",
	"updatedAt"
] as const;
export const userSortDirectionValues = ["asc", "desc"] as const;

export interface ManagedUser {
	id: string;
	name: string | null;
	email: string;
	image: string | null;
	phone: string | null;
	emailVerified: boolean;
	is2faEnabled: boolean;
	role: UserRole;
	activeSessionCount: number;
	createdAt: string;
	updatedAt: string;
}

export type UserSort = (typeof userSortValues)[number];
export type UserSortDirection = (typeof userSortDirectionValues)[number];
export type UserListResponse = PaginatedData<ManagedUser>;

export interface UserListQuery {
	page: number;
	pageSize: number;
	search?: string;
	role?: string;
	emailVerified?: string;
	fromDate?: string;
	toDate?: string;
	sort: UserSort;
	dir: UserSortDirection;
}

export interface UpdateUserRoleInput {
	id: string;
	role: UserRole;
}

export interface RevokeUserSessionsInput {
	id: string;
}

export interface RevokeUserSessionsResponse {
	revokedCount: number;
}
