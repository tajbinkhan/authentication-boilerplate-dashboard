import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	auditLogSortDirectionValues,
	auditLogSortValues
} from "@/features/audit-logs/types/audit-logs.types";

export const auditLogSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	actorId: parseAsString.withDefault(""),
	actor: parseAsString.withDefault(""),
	action: parseAsString.withDefault(""),
	targetType: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...auditLogSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...auditLogSortDirectionValues]).withDefault("desc")
};
