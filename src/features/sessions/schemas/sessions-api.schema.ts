import { z } from "zod";

import {
	sessionSortDirectionValues,
	sessionSortValues,
	sessionStatusValues,
	type SessionListQuery
} from "@/features/sessions/types/sessions.types";
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

const csvQuerySchema = z.preprocess(value => {
	const nextValue = optionalTrimmedStringSchema.parse(value);
	return nextValue;
}, z.string().optional().catch(undefined));

const statusQuerySchema = csvQuerySchema.refine(
	value =>
		!value ||
		value
			.split(",")
			.every(status =>
				sessionStatusValues.includes(status.trim() as (typeof sessionStatusValues)[number])
			),
	{ message: "Status is invalid" }
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

const sortQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Sort", sessionSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", sessionSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

export const sessionListQuerySchema = z
	.object({
		page: pageQuerySchema,
		pageSize: pageSizeQuerySchema,
		search: optionalTrimmedStringSchema,
		status: statusQuerySchema,
		deviceType: csvQuerySchema,
		fromDate: dateQuerySchema,
		toDate: dateQuerySchema,
		sort: sortQuerySchema,
		dir: directionQuerySchema
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createSessionListQuery(input: unknown): SessionListQuery {
	const query = sessionListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		search: query.search,
		status: query.status,
		deviceType: query.deviceType,
		fromDate: query.fromDate,
		toDate: query.toDate,
		sort: query.sort,
		dir: query.dir
	};
}

