import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import { userSortDirectionValues, userSortValues } from "@/features/users/types/users.types";

export const userSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	role: parseAsString.withDefault(""),
	emailVerified: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...userSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...userSortDirectionValues]).withDefault("desc")
};

