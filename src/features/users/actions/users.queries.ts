import { useQuery } from "@tanstack/react-query";

import { listUsers } from "./users.actions";
import { userKeys } from "./users.keys";
import type { UserListQuery } from "@/features/users/types/users.types";

export function useUsersQuery(filters: UserListQuery) {
	return useQuery({
		queryKey: userKeys.list(filters),
		queryFn: () => listUsers(filters)
	});
}
