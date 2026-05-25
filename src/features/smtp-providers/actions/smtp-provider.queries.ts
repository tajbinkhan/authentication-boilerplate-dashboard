import { useQuery } from "@tanstack/react-query";

import { listProviders } from "./smtp-provider.actions";
import { smtpProviderKeys } from "./smtp-provider.keys";
import type { SmtpProviderListQuery } from "@/features/smtp-providers/types/smtp-provider.types";

export function useProvidersQuery(filters: SmtpProviderListQuery) {
	return useQuery({
		queryKey: smtpProviderKeys.list(filters),
		queryFn: () => listProviders(filters)
	});
}
