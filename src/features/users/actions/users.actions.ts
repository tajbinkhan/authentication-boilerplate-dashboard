import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createUserListQuery } from "@/features/users/schemas/users-api.schema";
import type {
	CreateUserInput,
	DeleteUserInput,
	DeleteUserResponse,
	ManagedUser,
	RevokeUserSessionsInput,
	RevokeUserSessionsResponse,
	ResetUserTwoFactorInput,
	ResetUserTwoFactorResponse,
	UpdateUserInput,
	UpdateUserRoleInput,
	UserListQuery,
	UserListResponse
} from "@/features/users/types/users.types";

export async function listUsers(filters: UserListQuery): Promise<UserListResponse> {
	return apiClient<UserListResponse>({
		method: "GET",
		url: apiRoute.users,
		params: createUserListQuery(filters)
	});
}

export async function getUser(id: string): Promise<ManagedUser> {
	return apiClient<ManagedUser>({
		method: "GET",
		url: apiRoute.user(id)
	});
}

export async function createUser(data: CreateUserInput): Promise<ManagedUser> {
	return apiClient<ManagedUser>({
		method: "POST",
		url: apiRoute.users,
		data
	});
}

export async function updateUser({ id, ...data }: UpdateUserInput): Promise<ManagedUser> {
	return apiClient<ManagedUser>({
		method: "PATCH",
		url: apiRoute.user(id),
		data
	});
}

export async function updateUserRole({ id, role }: UpdateUserRoleInput): Promise<ManagedUser> {
	return apiClient<ManagedUser>({
		method: "PATCH",
		url: apiRoute.userRole(id),
		data: { role }
	});
}

export async function deleteUser({ id }: DeleteUserInput): Promise<DeleteUserResponse> {
	return apiClient<DeleteUserResponse>({
		method: "DELETE",
		url: apiRoute.user(id)
	});
}

export async function revokeUserSessions({
	id
}: RevokeUserSessionsInput): Promise<RevokeUserSessionsResponse> {
	return apiClient<RevokeUserSessionsResponse>({
		method: "POST",
		url: apiRoute.userSessionsRevoke(id)
	});
}

export async function resetUserTwoFactor({
	id
}: ResetUserTwoFactorInput): Promise<ResetUserTwoFactorResponse> {
	return apiClient<ResetUserTwoFactorResponse>({
		method: "POST",
		url: apiRoute.userTwoFactorReset(id)
	});
}
