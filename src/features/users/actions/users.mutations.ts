import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	createUser,
	deleteUser,
	resetUserTwoFactor,
	revokeUserSessions,
	updateUser,
	updateUserRole
} from "./users.actions";
import { userKeys } from "./users.keys";

export function useCreateUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}

export function useUpdateUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}

export function useUpdateUserRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUserRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}

export function useDeleteUserMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}

export function useRevokeUserSessionsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: revokeUserSessions,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}

export function useResetUserTwoFactorMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resetUserTwoFactor,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: userKeys.all });
		}
	});
}
