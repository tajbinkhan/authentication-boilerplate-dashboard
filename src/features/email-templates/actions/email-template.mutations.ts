import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateEmailTemplate } from "./email-template.actions";
import { emailTemplateKeys } from "./email-template.keys";

export function useUpdateEmailTemplateMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateEmailTemplate,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: emailTemplateKeys.all });
		}
	});
}
