import type { SessionListQuery } from "@/features/sessions/types/sessions.types";

export const sessionKeys = {
	all: ["sessions"] as const,
	lists: () => [...sessionKeys.all, "list"] as const,
	list: (filters: SessionListQuery) => [...sessionKeys.lists(), filters] as const
};
