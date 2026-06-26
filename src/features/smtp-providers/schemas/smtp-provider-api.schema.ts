import { z } from "zod";

import {
	type SmtpProviderListQuery,
	smtpProviderSortDirectionValues,
	smtpProviderSortValues
} from "@/features/smtp-providers/types/smtp-provider.types";
import {
	validateOptionalQueryString,
	validateQueryDate,
	validateQueryEnum,
	validateQueryNumber
} from "@/validators/common-rule";

export const smtpProviderListQuerySchema = z
	.object({
		page: validateQueryNumber(1),
		pageSize: validateQueryNumber(10, { max: 100 }),
		search: validateOptionalQueryString,
		providerType: validateOptionalQueryString,
		isActive: validateOptionalQueryString,
		fromDate: validateQueryDate,
		toDate: validateQueryDate,
		sort: validateQueryEnum("Sort", smtpProviderSortValues, "createdAt"),
		dir: validateQueryEnum("Direction", smtpProviderSortDirectionValues, "desc")
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createSmtpProviderListQuery(input: unknown): SmtpProviderListQuery {
	return smtpProviderListQuerySchema.parse(input);
}
