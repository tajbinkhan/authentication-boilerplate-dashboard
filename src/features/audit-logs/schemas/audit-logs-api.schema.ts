import { z } from "zod";

import {
	auditLogSortDirectionValues,
	auditLogSortValues,
	type AuditLogListQuery
} from "@/features/audit-logs/types/audit-logs.types";
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

const actorIdQuerySchema = z.preprocess(
	value => optionalTrimmedStringSchema.parse(value),
	z.uuid().optional().catch(undefined)
);

const actorQuerySchema = z
	.preprocess(firstSearchParamValue, z.string().optional())
	.optional()
	.catch(undefined);

const actionQuerySchema = z
	.preprocess(firstSearchParamValue, z.string().optional())
	.optional()
	.catch(undefined);

const targetTypeQuerySchema = z
	.preprocess(firstSearchParamValue, z.string().optional())
	.optional()
	.catch(undefined);

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
	.preprocess(firstSearchParamValue, validateEnum("Sort", auditLogSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", auditLogSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

export const auditLogListQuerySchema = z
	.object({
		page: pageQuerySchema,
		pageSize: pageSizeQuerySchema,
		actorId: actorIdQuerySchema,
		actor: actorQuerySchema,
		action: actionQuerySchema,
		targetType: targetTypeQuerySchema,
		fromDate: dateQuerySchema,
		toDate: dateQuerySchema,
		sort: sortQuerySchema,
		dir: directionQuerySchema
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createAuditLogListQuery(input: unknown): AuditLogListQuery {
	const query = auditLogListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		actorId: query.actorId,
		actor: query.actor,
		action: query.action,
		targetType: query.targetType,
		fromDate: query.fromDate,
		toDate: query.toDate,
		sort: query.sort,
		dir: query.dir
	};
}
