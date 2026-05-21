import { z } from "zod";

import {
	userRoleValues,
	userSortDirectionValues,
	userSortValues,
	type UserListQuery
} from "@/features/users/types/users.types";
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

const roleQuerySchema = csvQuerySchema.refine(
	value =>
		!value ||
		value
			.split(",")
			.every(role => userRoleValues.includes(role.trim() as (typeof userRoleValues)[number])),
	{ message: "Role is invalid" }
);

const emailVerifiedQuerySchema = optionalTrimmedStringSchema.refine(
	value => !value || value === "true" || value === "false",
	{ message: "Email verified filter is invalid" }
);

const isApprovedQuerySchema = optionalTrimmedStringSchema.refine(
	value => !value || value === "true" || value === "false",
	{ message: "Approved filter is invalid" }
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
	.preprocess(firstSearchParamValue, validateEnum("Sort", userSortValues))
	.optional()
	.catch("createdAt")
	.default("createdAt");

const directionQuerySchema = z
	.preprocess(firstSearchParamValue, validateEnum("Direction", userSortDirectionValues))
	.optional()
	.catch("desc")
	.default("desc");

export const userListQuerySchema = z
	.object({
		page: pageQuerySchema,
		pageSize: pageSizeQuerySchema,
		search: optionalTrimmedStringSchema,
		role: roleQuerySchema,
		emailVerified: emailVerifiedQuerySchema,
		isApproved: isApprovedQuerySchema,
		fromDate: dateQuerySchema,
		toDate: dateQuerySchema,
		sort: sortQuerySchema,
		dir: directionQuerySchema
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createUserListQuery(input: unknown): UserListQuery {
	const query = userListQuerySchema.parse(input);

	return {
		page: query.page,
		pageSize: query.pageSize,
		search: query.search,
		role: query.role,
		emailVerified: query.emailVerified,
		isApproved: query.isApproved,
		fromDate: query.fromDate,
		toDate: query.toDate,
		sort: query.sort,
		dir: query.dir
	};
}

