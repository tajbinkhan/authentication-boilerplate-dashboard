export interface Role {
	id: string;
	name: string;
	description: string | null;
	isSystem: boolean;
	createdAt: string;
	updatedAt: string;
}

export type RoleListResponse = PaginatedData<Role>;

export interface CreateRoleInput {
	name: string;
	description?: string | null;
}

export interface UpdateRoleInput {
	id: string;
	name?: string;
	description?: string | null;
}
