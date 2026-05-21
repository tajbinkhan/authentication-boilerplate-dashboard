import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings } from "./system.actions";
import { systemKeys } from "./system.keys";

export function useUpdateSystemSettingsMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateSettings,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: systemKeys.all });
		}
	});
}
