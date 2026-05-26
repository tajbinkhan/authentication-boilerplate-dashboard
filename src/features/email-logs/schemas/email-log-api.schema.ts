import { z } from "zod";

import {
	emailLogSortDirectionValues,
	emailLogSortValues,
	type EmailLogListQuery,
	type EmailLogStatus
} from "@/features/email-logs/types/email-log.types";
import { validateEnum } from "@/validators/common-rule";

function firstSearchParamValue(value: unknown): unknown {
	return Array.isArray(value) ? value[0] : value;
}

const optionalTrimmedStringSchema = z.preprocess(value => {
	const nextValue = firstSearchParamValue(value);
	if (typeof nextValue !== "string") return undefined;

	const trimmed = nextValue.trim();
	return trimmed || undefined;
}, z.string().optional().catch(undefined));

const dateQuerySchema = z.preprocess(
	value => optionalTrimmedStringSchema.parse(value),
	z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.catch(undefined)
);

const pageQuerySchema = z
	.preprocess(firstSearchParamValue, z.coerce.number().int().min(1))
	.optional()
	.catch(1)
	.default(1);

const pageSizeQuerySchema = z
	.preprocess(firstSearchParamValue, z.coerce.number().int().min(1).max(100))
	.optional()
	.catch(10)
	.default(10);

const emailLogSortQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Sort", emailLogSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const emailLogDirectionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", emailLogSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

const emailLogStatusValues = ["sent", "failed"] as const;

const emailLogStatusQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Status", emailLogStatusValues).optional())
	.catch(undefined);

export const emailLogListQuerySchema = z
	.object({
		page: pageQuerySchema,
		pageSize: pageSizeQuerySchema,
		providerId: optionalTrimmedStringSchema,
		toEmail: optionalTrimmedStringSchema,
		status: emailLogStatusQuerySchema,
		templateKey: optionalTrimmedStringSchema,
		fromDate: dateQuerySchema,
		toDate: dateQuerySchema,
		sort: emailLogSortQuerySchema,
		dir: emailLogDirectionQuerySchema
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createEmailLogListQuery(input: unknown): EmailLogListQuery {
	const query = emailLogListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		providerId: query.providerId,
		toEmail: query.toEmail,
		status: query.status as EmailLogStatus | undefined,
		templateKey: query.templateKey,
		fromDate: query.fromDate,
		toDate: query.toDate,
		sort: query.sort as EmailLogListQuery["sort"],
		dir: query.dir as EmailLogListQuery["dir"]
	};
}
