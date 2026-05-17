import { useQuery } from "@tanstack/react-query";

import { listSessions } from "./sessions.actions";
import { sessionKeys } from "./sessions.keys";
import type { SessionListQuery } from "@/features/sessions/types/sessions.types";

export function useSessionsQuery(filters: SessionListQuery) {
	return useQuery({
		queryKey: sessionKeys.list(filters),
		queryFn: () => listSessions(filters)
	});
}
