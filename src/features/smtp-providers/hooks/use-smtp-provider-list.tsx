"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useProvidersQuery } from "@/features/smtp-providers/actions/smtp-provider.queries";
import { smtpProviderSearchParams } from "@/features/smtp-providers/schemas/smtp-provider.schema";
import type {
	SmtpProvider,
	SmtpProviderListQuery,
	SmtpProviderListResponse,
	SmtpProviderSort,
	SmtpProviderSortDirection
} from "@/features/smtp-providers/types/smtp-provider.types";
import { smtpProviderSortValues } from "@/features/smtp-providers/types/smtp-provider.types";

type SmtpProviderPagination = PaginatedData<SmtpProvider>;

interface SmtpProviderListContextValue {
	tableData: SmtpProvider[];
	pagination: SmtpProviderPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	providerType: string;
	isActive: string;
	fromDate: string;
	toDate: string;
	sort: SmtpProviderSort;
	dir: SmtpProviderSortDirection;
	handleSorting: (sort: string, dir: SmtpProviderSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleDateChange: (key: "fromDate" | "toDate", value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: SmtpProviderListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};
const sortableSmtpProviderColumns = new Set<string>(smtpProviderSortValues);
const SmtpProviderListContext = createContext<SmtpProviderListContextValue | null>(null);

interface SmtpProviderListProviderProps extends GlobalLayoutProps {}

export function SmtpProviderListProvider({ children }: SmtpProviderListProviderProps) {
	const [params, setParams] = useQueryStates(smtpProviderSearchParams);
	const filters = useMemo<SmtpProviderListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			providerType: params.providerType || undefined,
			isActive: params.isActive || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.fromDate,
			params.isActive,
			params.page,
			params.pageSize,
			params.providerType,
			params.search,
			params.sort,
			params.toDate
		]
	);
	const providersQuery = useProvidersQuery(filters);
	const pagination = providersQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: SmtpProviderSortDirection) => {
			if (!sortableSmtpProviderColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as SmtpProviderSort, dir: nextDir, page: 1 });
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

	const handleSearchChange = useCallback(
		(value: string) => {
			void setParams({ search: value.trim() || null, page: 1 });
		},
		[setParams]
	);

	const handleDateChange = useCallback(
		(key: "fromDate" | "toDate", value: string) => {
			void setParams({ [key]: value.trim() || null, page: 1 });
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
			search: null,
			providerType: null,
			isActive: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(providersQuery.refetch(), {
			loading: "Refreshing providers...",
			success: "Providers refreshed",
			error: "Failed to refresh providers"
		});
	}, [providersQuery]);

	const value = useMemo<SmtpProviderListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: providersQuery.isLoading,
			isFetching: providersQuery.isFetching,
			error: providersQuery.error,
			search: params.search,
			providerType: params.providerType,
			isActive: params.isActive,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleDateChange,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			handleDateChange,
			handleDateRangeChange,
			handleOptionFilter,
			handleRefresh,
			handleResetAll,
			handleSearchChange,
			handleSorting,
			pagination.page,
			pagination.pageSize,
			pagination.rows,
			pagination.total,
			params.dir,
			params.fromDate,
			params.isActive,
			params.providerType,
			params.search,
			params.sort,
			params.toDate,
			providersQuery.error,
			providersQuery.isFetching,
			providersQuery.isLoading
		]
	);

	return <SmtpProviderListContext.Provider value={value}>{children}</SmtpProviderListContext.Provider>;
}

export function useSmtpProviderList() {
	const context = useContext(SmtpProviderListContext);

	if (!context) {
		throw new Error("useSmtpProviderList must be used within SmtpProviderListProvider");
	}

	return context;
}
