import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeOtherSessions, revokeSession } from "./sessions.actions";
import { sessionKeys } from "./sessions.keys";

export function useRevokeSessionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: revokeSession,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: sessionKeys.all });
		}
	});
}

export function useRevokeOtherSessionsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: revokeOtherSessions,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: sessionKeys.all });
		}
	});
}
