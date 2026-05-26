"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useProvidersQuery } from "@/features/smtp-providers/actions/smtp-provider.queries";
import { useEmailLogsQuery } from "@/features/email-logs/actions/email-log.queries";
import { emailLogSearchParams } from "@/features/email-logs/schemas/email-log.schema";
import type {
	EmailLog,
	EmailLogListQuery,
	EmailLogListResponse,
	EmailLogSort,
	EmailLogSortDirection,
	EmailLogStatus
} from "@/features/email-logs/types/email-log.types";
import { emailLogSortValues } from "@/features/email-logs/types/email-log.types";

type EmailLogPagination = PaginatedData<EmailLog>;

interface EmailLogListContextValue {
	tableData: EmailLog[];
	pagination: EmailLogPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	providerId: string;
	toEmail: string;
	status: string;
	templateKey: string;
	fromDate: string;
	toDate: string;
	sort: EmailLogSort;
	dir: EmailLogSortDirection;
	providersQuery: ReturnType<typeof useProvidersQuery>;
	handleSorting: (sort: string, dir: EmailLogSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleToEmailChange: (value: string) => void;
	handleStatusFilter: (value?: EmailLogStatus) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: EmailLogListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableEmailLogColumns = new Set<string>(emailLogSortValues);
const EmailLogListContext = createContext<EmailLogListContextValue | null>(null);

export function EmailLogListProvider({ children }: GlobalLayoutProps) {
	const [params, setParams] = useQueryStates(emailLogSearchParams);
	const filters = useMemo<EmailLogListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			providerId: params.providerId || undefined,
			toEmail: params.toEmail || undefined,
			status: params.status ? (params.status as EmailLogStatus) : undefined,
			templateKey: params.templateKey || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.fromDate,
			params.page,
			params.pageSize,
			params.providerId,
			params.sort,
			params.status,
			params.templateKey,
			params.toDate,
			params.toEmail
		]
	);
	const emailLogsQuery = useEmailLogsQuery(filters);
	const providersQuery = useProvidersQuery({
		page: 1,
		pageSize: 500,
		sort: "name",
		dir: "asc"
	});
	const pagination = emailLogsQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: EmailLogSortDirection) => {
			if (!sortableEmailLogColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as EmailLogSort, dir: nextDir, page: 1 });
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

	const handleToEmailChange = useCallback(
		(value: string) => {
			void setParams({ toEmail: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleStatusFilter = useCallback(
		(value?: EmailLogStatus) => {
			void setParams({ status: value || null, page: 1 });
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
			providerId: null,
			toEmail: null,
			status: null,
			templateKey: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(emailLogsQuery.refetch(), {
			loading: "Refreshing email logs...",
			success: "Email logs refreshed",
			error: "Failed to refresh email logs"
		});
	}, [emailLogsQuery]);

	const value = useMemo<EmailLogListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: emailLogsQuery.isLoading,
			isFetching: emailLogsQuery.isFetching,
			error: emailLogsQuery.error,
			providerId: params.providerId,
			toEmail: params.toEmail,
			status: params.status,
			templateKey: params.templateKey,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			providersQuery,
			handleSorting,
			handleOptionFilter,
			handleToEmailChange,
			handleStatusFilter,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			emailLogsQuery.error,
			emailLogsQuery.isFetching,
			emailLogsQuery.isLoading,
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSorting,
			handleStatusFilter,
			handleToEmailChange,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.fromDate,
			params.providerId,
			params.sort,
			params.status,
			params.templateKey,
			params.toDate,
			params.toEmail,
			providersQuery
		]
	);

	return <EmailLogListContext.Provider value={value}>{children}</EmailLogListContext.Provider>;
}

export function useEmailLogList() {
	const context = useContext(EmailLogListContext);

	if (!context) {
		throw new Error("useEmailLogList must be used within EmailLogListProvider");
	}

	return context;
}

