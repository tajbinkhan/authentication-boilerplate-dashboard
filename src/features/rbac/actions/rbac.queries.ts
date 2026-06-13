import { useQuery } from "@tanstack/react-query";

import { listPermissions, listRoles } from "./rbac.actions";
import { rbacKeys } from "./rbac.keys";

export function useRolesQuery() {
	return useQuery({
		queryKey: rbacKeys.roles(),
		queryFn: listRoles
	});
}

export function usePermissionsQuery() {
	return useQuery({
		queryKey: rbacKeys.permissions(),
		queryFn: listPermissions
	});
}

