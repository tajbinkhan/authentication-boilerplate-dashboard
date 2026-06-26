import { z } from "zod";

import {
	type UserListQuery,
	userRoleValues,
	userSortDirectionValues,
	userSortValues
} from "@/features/users/types/users.types";
import {
	validateCsvQueryEnum,
	validateOptionalQueryString,
	validateQueryBooleanString,
	validateQueryDate,
	validateQueryEnum,
	validateQueryNumber
} from "@/validators/common-rule";

const roleQuerySchema = validateCsvQueryEnum(userRoleValues, "Role is invalid");
const emailVerifiedQuerySchema = validateQueryBooleanString("Email verified filter is invalid");
const isApprovedQuerySchema = validateQueryBooleanString("Approved filter is invalid");

export const userListQuerySchema = z
	.object({
		page: validateQueryNumber(1),
		pageSize: validateQueryNumber(10, { max: 100 }),
		search: validateOptionalQueryString,
		role: roleQuerySchema,
		emailVerified: emailVerifiedQuerySchema,
		isApproved: isApprovedQuerySchema,
		fromDate: validateQueryDate,
		toDate: validateQueryDate,
		sort: validateQueryEnum("Sort", userSortValues, "createdAt"),
		dir: validateQueryEnum("Direction", userSortDirectionValues, "desc")
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createUserListQuery(input: unknown): UserListQuery {
	return userListQuerySchema.parse(input);
}
