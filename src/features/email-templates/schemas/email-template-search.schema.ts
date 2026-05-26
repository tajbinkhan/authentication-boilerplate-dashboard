import { parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs";

import {
	emailTemplateSortDirectionValues,
	emailTemplateSortValues
} from "@/features/email-templates/types/email-template.types";

export const emailTemplateSearchParams = {
	page: parseAsInteger.withDefault(1),
	pageSize: parseAsInteger.withDefault(10),
	search: parseAsString.withDefault(""),
	isActive: parseAsString.withDefault(""),
	fromDate: parseAsString.withDefault(""),
	toDate: parseAsString.withDefault(""),
	sort: parseAsStringEnum([...emailTemplateSortValues]).withDefault("createdAt"),
	dir: parseAsStringEnum([...emailTemplateSortDirectionValues]).withDefault("desc")
};
