import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	deleteEmailLog,
	resendEmailLog
} from "./email-log.actions";
import { emailLogKeys } from "./email-log.keys";

export function useResendEmailLogMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: resendEmailLog,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailLogKeys.all });
		}
	});
}

export function useDeleteEmailLogMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEmailLog,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailLogKeys.all });
		}
	});
}
