import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	emailLogSortDirectionValues,
	emailLogSortValues
} from "@/features/email-logs/types/email-log.types";

export const emailLogSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	providerId: parseAsString.withDefault(""),
	toEmail: parseAsString.withDefault(""),
	status: parseAsString.withDefault(""),
	templateKey: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...emailLogSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...emailLogSortDirectionValues]).withDefault("desc")
};
