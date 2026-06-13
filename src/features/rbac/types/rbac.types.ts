export interface Permission {
	id: string;
	resource: string;
	action: string;
	scope: string | null;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
}

export interface Role {
	id: string;
	name: string;
	description: string | null;
	isSystem: boolean;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
}

export type RoleListResponse = PaginatedData<Role>;
export type PermissionListResponse = PaginatedData<Permission>;

export interface CreateRoleInput {
	name: string;
	description?: string | null;
	permissionIds?: string[];
}

export interface UpdateRoleInput {
	id: string;
	name?: string;
	description?: string | null;
}

export interface UpdateRolePermissionsInput {
	id: string;
	permissionIds: string[];
}

