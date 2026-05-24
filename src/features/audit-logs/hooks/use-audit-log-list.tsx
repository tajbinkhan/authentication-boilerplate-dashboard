"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useAuditLogsQuery } from "@/features/audit-logs/actions/audit-logs.queries";
import { auditLogSearchParams } from "@/features/audit-logs/schemas/audit-logs.schema";
import type {
	AuditLog,
	AuditLogAction,
	AuditLogListQuery,
	AuditLogListResponse,
	AuditLogSort,
	AuditLogSortDirection,
	AuditLogTargetType
} from "@/features/audit-logs/types/audit-logs.types";
import { auditLogSortValues } from "@/features/audit-logs/types/audit-logs.types";

type AuditLogPagination = PaginatedData<AuditLog>;

interface AuditLogListContextValue {
	tableData: AuditLog[];
	pagination: AuditLogPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	actor: string;
	action: string;
	targetType: string;
	fromDate: string;
	toDate: string;
	sort: AuditLogSort;
	dir: AuditLogSortDirection;
	handleSorting: (sort: string, dir: AuditLogSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleActorChange: (value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: AuditLogListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableAuditLogColumns = new Set<string>(auditLogSortValues);
const AuditLogListContext = createContext<AuditLogListContextValue | null>(null);

interface AuditLogListProviderProps extends GlobalLayoutProps {}

export function AuditLogListProvider({ children }: AuditLogListProviderProps) {
	const [params, setParams] = useQueryStates(auditLogSearchParams);
	const filters = useMemo<AuditLogListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			actorId: params.actorId || undefined,
			actor: params.actor || undefined,
			action: params.action ? (params.action as AuditLogAction) : undefined,
			targetType: params.targetType ? (params.targetType as AuditLogTargetType) : undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.action,
			params.actor,
			params.actorId,
			params.dir,
			params.fromDate,
			params.page,
			params.pageSize,
			params.sort,
			params.targetType,
			params.toDate
		]
	);
	const auditLogsQuery = useAuditLogsQuery(filters);
	const pagination = auditLogsQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: AuditLogSortDirection) => {
			if (!sortableAuditLogColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as AuditLogSort, dir: nextDir, page: 1 });
		},
		[setParams]
	);

	const handleOptionFilter = useCallback(
		(key: string, value?: string | string[] | null) => {
			const normalizedValue = Array.isArray(value) ? value.join(",") : value;

			if (key === "page") {
				void setParams({ page: Number(normalizedValue) || 1 });
				return;
			}

			if (key === "limit" || key === "pageSize") {
				void setParams({
					pageSize: Number(normalizedValue) || defaultPagination.pageSize,
					page: defaultPagination.page
				});
			}
		},
		[setParams]
	);

	const handleActorChange = useCallback(
		(value: string) => {
			void setParams({ actor: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleDateRangeChange = useCallback(
		(value: { fromDate?: string; toDate?: string }) => {
			void setParams({
				fromDate: value.fromDate?.trim() || null,
				toDate: value.toDate?.trim() || null,
				page: 1
			});
		},
		[setParams]
	);

	const handleResetAll = useCallback(() => {
		void setParams({
			page: 1,
			pageSize: 10,
			actorId: null,
			actor: null,
			action: null,
			targetType: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(auditLogsQuery.refetch(), {
			loading: "Refreshing audit logs...",
			success: "Audit logs refreshed",
			error: "Failed to refresh audit logs"
		});
	}, [auditLogsQuery]);

	const value = useMemo<AuditLogListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: auditLogsQuery.isLoading,
			isFetching: auditLogsQuery.isFetching,
			error: auditLogsQuery.error,
			actor: params.actor,
			action: params.action,
			targetType: params.targetType,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleActorChange,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			auditLogsQuery.error,
			auditLogsQuery.isFetching,
			auditLogsQuery.isLoading,
			handleActorChange,
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSorting,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.action,
			params.actor,
			params.dir,
			params.fromDate,
			params.sort,
			params.targetType,
			params.toDate
		]
	);

	return <AuditLogListContext.Provider value={value}>{children}</AuditLogListContext.Provider>;
}

export function useAuditLogList() {
	const context = useContext(AuditLogListContext);

	if (!context) {
		throw new Error("useAuditLogList must be used within AuditLogListProvider");
	}

	return context;
}
