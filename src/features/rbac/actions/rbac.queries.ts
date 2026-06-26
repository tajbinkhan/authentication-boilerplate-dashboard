import { useQuery } from "@tanstack/react-query";

import { listRoles } from "./rbac.actions";
import { rbacKeys } from "./rbac.keys";

export function useRolesQuery() {
	return useQuery({
		queryKey: rbacKeys.roles(),
		queryFn: listRoles
	});
}
