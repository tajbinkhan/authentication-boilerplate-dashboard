import type { UserListQuery } from "@/features/users/types/users.types";

export const userKeys = {
	all: ["users"] as const,
	lists: () => [...userKeys.all, "list"] as const,
	list: (filters: UserListQuery) => [...userKeys.lists(), filters] as const
};
