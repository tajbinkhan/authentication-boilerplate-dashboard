import { z } from "zod";

import {
	type EmailLogListQuery,
	emailLogSortDirectionValues,
	emailLogSortValues,
	emailLogStatusValues
} from "@/features/email-logs/types/email-log.types";
import {
	validateOptionalQueryEnum,
	validateOptionalQueryString,
	validateQueryDate,
	validateQueryEnum,
	validateQueryNumber
} from "@/validators/common-rule";

export const emailLogListQuerySchema = z
	.object({
		page: validateQueryNumber(1),
		pageSize: validateQueryNumber(10, { max: 100 }),
		providerId: validateOptionalQueryString,
		toEmail: validateOptionalQueryString,
		status: validateOptionalQueryEnum("Status", emailLogStatusValues),
		templateKey: validateOptionalQueryString,
		fromDate: validateQueryDate,
		toDate: validateQueryDate,
		sort: validateQueryEnum("Sort", emailLogSortValues, "createdAt"),
		dir: validateQueryEnum("Direction", emailLogSortDirectionValues, "desc")
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createEmailLogListQuery(input: unknown): EmailLogListQuery {
	return emailLogListQuerySchema.parse(input);
}
