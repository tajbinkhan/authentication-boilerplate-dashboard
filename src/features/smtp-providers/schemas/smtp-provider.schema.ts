import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	smtpProviderSortDirectionValues,
	smtpProviderSortValues
} from "@/features/smtp-providers/types/smtp-provider.types";

export const smtpProviderSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	providerType: parseAsString.withDefault(""),
	isActive: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...smtpProviderSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...smtpProviderSortDirectionValues]).withDefault("desc")
};
