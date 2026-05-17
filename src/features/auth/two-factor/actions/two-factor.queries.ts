import { useQuery } from "@tanstack/react-query";

import { getTwoFactorStatus } from "@/features/auth/two-factor/actions/two-factor.actions";
import { twoFactorKeys } from "@/features/auth/two-factor/actions/two-factor.keys";

export function useTwoFactorStatusQuery() {
	return useQuery({
		queryKey: twoFactorKeys.status(),
		queryFn: getTwoFactorStatus
	});
}
