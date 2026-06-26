import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRole, deleteRole, updateRole } from "./rbac.actions";
import { rbacKeys } from "./rbac.keys";

export function useCreateRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
		}
	});
}

export function useUpdateRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
		}
	});
}

export function useDeleteRoleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRole,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: rbacKeys.roles() });
		}
	});
}
