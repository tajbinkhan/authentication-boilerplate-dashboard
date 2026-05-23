import { useQuery } from "@tanstack/react-query";

import { getUser, listUsers } from "./users.actions";
import { userKeys } from "./users.keys";
import type { UserListQuery } from "@/features/users/types/users.types";

export function useUsersQuery(filters: UserListQuery) {
	return useQuery({
		queryKey: userKeys.list(filters),
		queryFn: () => listUsers(filters)
	});
}

export function useUserQuery(id: string, enabled = true) {
	return useQuery({
		queryKey: userKeys.detail(id),
		queryFn: () => getUser(id),
		enabled: Boolean(id) && enabled,
		refetchOnMount: "always"
	});
}
