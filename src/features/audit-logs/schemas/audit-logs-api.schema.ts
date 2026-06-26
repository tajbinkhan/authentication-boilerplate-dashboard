import { z } from "zod";

import {
	type AuditLogListQuery,
	auditLogSortDirectionValues,
	auditLogSortValues
} from "@/features/audit-logs/types/audit-logs.types";
import {
	validateOptionalQueryString,
	validateQueryDate,
	validateQueryEnum,
	validateQueryNumber,
	validateQueryUuid
} from "@/validators/common-rule";

export const auditLogListQuerySchema = z
	.object({
		page: validateQueryNumber(1),
		pageSize: validateQueryNumber(10, { max: 100 }),
		actorId: validateQueryUuid,
		actor: validateOptionalQueryString,
		action: validateOptionalQueryString,
		targetType: validateOptionalQueryString,
		fromDate: validateQueryDate,
		toDate: validateQueryDate,
		sort: validateQueryEnum("Sort", auditLogSortValues, "createdAt"),
		dir: validateQueryEnum("Direction", auditLogSortDirectionValues, "desc")
	})
	.refine(data => !data.fromDate || !data.toDate || data.fromDate <= data.toDate, {
		message: "fromDate must be less than or equal to toDate"
	});

export function createAuditLogListQuery(input: unknown): AuditLogListQuery {
	return auditLogListQuerySchema.parse(input);
}
