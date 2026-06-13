import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import type {
	CreateRoleInput,
	PermissionListResponse,
	Role,
	RoleListResponse,
	UpdateRoleInput,
	UpdateRolePermissionsInput
} from "@/features/rbac/types/rbac.types";

export function listRoles(): Promise<RoleListResponse> {
	return apiClient<RoleListResponse>({
		method: "GET",
		url: apiRoute.rbacRoles,
		params: { page: 1, pageSize: 100, sort: "name", dir: "asc" }
	});
}

export function listPermissions(): Promise<PermissionListResponse> {
	return apiClient<PermissionListResponse>({
		method: "GET",
		url: apiRoute.rbacPermissions,
		params: { page: 1, pageSize: 500, sort: "resource", dir: "asc" }
	});
}

export function createRole(data: CreateRoleInput): Promise<Role> {
	return apiClient<Role>({
		method: "POST",
		url: apiRoute.rbacRoles,
		data
	});
}

export function updateRole({ id, ...data }: UpdateRoleInput): Promise<Role> {
	return apiClient<Role>({
		method: "PATCH",
		url: apiRoute.rbacRole(id),
		data
	});
}

export function deleteRole(id: string): Promise<{ deleted: boolean }> {
	return apiClient<{ deleted: boolean }>({
		method: "DELETE",
		url: apiRoute.rbacRole(id)
	});
}

export function updateRolePermissions({
	id,
	permissionIds
}: UpdateRolePermissionsInput): Promise<Role> {
	return apiClient<Role>({
		method: "PUT",
		url: apiRoute.rbacRolePermissions(id),
		data: { permissionIds }
	});
}

