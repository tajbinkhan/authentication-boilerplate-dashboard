import { useQuery } from "@tanstack/react-query";

import { listEmailLogs } from "./email-log.actions";
import { emailLogKeys } from "./email-log.keys";
import type { EmailLogListQuery } from "@/features/email-logs/types/email-log.types";

export function useEmailLogsQuery(filters: EmailLogListQuery) {
	return useQuery({
		queryKey: emailLogKeys.list(filters),
		queryFn: () => listEmailLogs(filters)
	});
}
