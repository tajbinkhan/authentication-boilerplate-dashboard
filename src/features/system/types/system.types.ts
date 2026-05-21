import type { UserRole } from "@/features/users/types/users.types";

export type AccessModel = "OPEN" | "APPROVAL_BASED" | "CLOSED";

export interface SystemSettings {
	accessModel: AccessModel;
	allowedRoles: UserRole[];
}

export interface UpdateSystemSettingsInput {
	accessModel?: AccessModel;
	allowedRoles?: UserRole[];
}

export interface PublicSystemSettings {
	accessModel: AccessModel;
	allowedRoles: UserRole[];
}
