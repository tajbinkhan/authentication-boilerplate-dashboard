import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeUserSessions, updateUserRole } from "./users.actions";
import { userKeys } from "./users.keys";

export function useUpdateUserRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUserRole,
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
