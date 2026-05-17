import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	sessionSortDirectionValues,
	sessionSortValues
} from "@/features/sessions/types/sessions.types";

export const sessionSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	status: parseAsString.withDefault(""),
	deviceType: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...sessionSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...sessionSortDirectionValues]).withDefault("desc")
};

