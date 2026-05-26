"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useEmailTemplatesQuery } from "@/features/email-templates/actions/email-template.queries";
import { emailTemplateSearchParams } from "@/features/email-templates/schemas/email-template-search.schema";
import type {
	EmailTemplate,
	EmailTemplateListQuery,
	EmailTemplateListResponse,
	EmailTemplateSort,
	EmailTemplateSortDirection
} from "@/features/email-templates/types/email-template.types";
import { emailTemplateSortValues } from "@/features/email-templates/types/email-template.types";

type EmailTemplatePagination = PaginatedData<EmailTemplate>;

interface EmailTemplateListContextValue {
	tableData: EmailTemplate[];
	pagination: EmailTemplatePagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	isActive: string;
	fromDate: string;
	toDate: string;
	sort: EmailTemplateSort;
	dir: EmailTemplateSortDirection;
	handleSorting: (sort: string, dir: EmailTemplateSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleDateChange: (key: "fromDate" | "toDate", value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: EmailTemplateListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};
const sortableEmailTemplateColumns = new Set<string>(emailTemplateSortValues);
const EmailTemplateListContext = createContext<EmailTemplateListContextValue | null>(null);

interface EmailTemplateListProviderProps extends GlobalLayoutProps {}

export function EmailTemplateListProvider({ children }: EmailTemplateListProviderProps) {
	const [params, setParams] = useQueryStates(emailTemplateSearchParams);

	const filters = useMemo<EmailTemplateListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			isActive: params.isActive || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.page,
			params.pageSize,
			params.search,
			params.isActive,
			params.fromDate,
			params.toDate,
			params.sort,
			params.dir
		]
	);

	const templatesQuery = useEmailTemplatesQuery(filters);
	const pagination = templatesQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: EmailTemplateSortDirection) => {
			if (!sortableEmailTemplateColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as EmailTemplateSort, dir: nextDir, page: 1 });
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
			isActive: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(templatesQuery.refetch(), {
			loading: "Refreshing templates...",
			success: "Templates refreshed",
			error: "Failed to refresh templates"
		});
	}, [templatesQuery]);

	const value = useMemo<EmailTemplateListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: templatesQuery.isLoading,
			isFetching: templatesQuery.isFetching,
			error: templatesQuery.error,
			search: params.search,
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
			params.search,
			params.sort,
			params.toDate,
			templatesQuery.error,
			templatesQuery.isFetching,
			templatesQuery.isLoading
		]
	);

	return (
		<EmailTemplateListContext.Provider value={value}>{children}</EmailTemplateListContext.Provider>
	);
}

export function useEmailTemplateList() {
	const context = useContext(EmailTemplateListContext);

	if (!context) {
		throw new Error("useEmailTemplateList must be used within EmailTemplateListProvider");
	}

	return context;
}
