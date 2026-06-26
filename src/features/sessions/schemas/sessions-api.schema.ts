import { z } from "zod";

import {
	type SessionListQuery,
	sessionSortDirectionValues,
	sessionSortValues,
	sessionStatusValues
} from "@/features/sessions/types/sessions.types";
import {
	validateCsvQueryEnum,
	validateOptionalQueryString,
	validateQueryDate,
	validateQueryEnum,
	validateQueryNumber
} from "@/validators/common-rule";

const statusQuerySchema = validateCsvQueryEnum(sessionStatusValues, "Status is invalid");

export const sessionListQuerySchema = z
	.object({
		page: validateQueryNumber(1),
		pageSize: validateQueryNumber(10, { max: 100 }),
		search: validateOptionalQueryString,
		status: statusQuerySchema,
		deviceType: validateOptionalQueryString,
		fromDate: validateQueryDate,
		toDate: validateQueryDate,
		sort: validateQueryEnum("Sort", sessionSortValues, "createdAt"),
		dir: validateQueryEnum("Direction", sessionSortDirectionValues, "desc")
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createSessionListQuery(input: unknown): SessionListQuery {
	return sessionListQuerySchema.parse(input);
}
