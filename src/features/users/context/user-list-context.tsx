"use client";

import { useQueryStates } from "nuqs";
import { createContext, useCallback, useContext, useMemo } from "react";
import { toast } from "sonner";

import { useUsersQuery } from "@/features/users/actions/users.queries";
import { userSearchParams } from "@/features/users/schemas/users.schema";
import type {
	ManagedUser,
	UserListQuery,
	UserListResponse,
	UserSort,
	UserSortDirection
} from "@/features/users/types/users.types";
import { userSortValues } from "@/features/users/types/users.types";

type UserPagination = PaginatedData<ManagedUser>;

interface UserListContextValue {
	tableData: ManagedUser[];
	pagination: UserPagination;
	isLoading: boolean;
	isFetching: boolean;
	error: unknown;
	search: string;
	role: string;
	emailVerified: string;
	isApproved: string;
	fromDate: string;
	toDate: string;
	sort: UserSort;
	dir: UserSortDirection;
	handleSorting: (sort: string, dir: UserSortDirection) => void;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	handleSearchChange: (value: string) => void;
	handleEmailVerifiedChange: (value: string) => void;
	handleIsApprovedChange: (value: string) => void;
	handleDateRangeChange: (value: { fromDate?: string; toDate?: string }) => void;
	handleResetAll: () => void;
	handleRefresh: () => void;
}

const defaultPagination: UserListResponse = {
	rows: [],
	total: 0,
	page: 1,
	pageSize: 10
};

const sortableUserColumns = new Set<string>(userSortValues);
const UserListContext = createContext<UserListContextValue | null>(null);

interface UserListProviderProps extends GlobalLayoutProps {}

export function UserListProvider({ children }: UserListProviderProps) {
	const [params, setParams] = useQueryStates(userSearchParams);
	const filters = useMemo<UserListQuery>(
		() => ({
			page: params.page,
			pageSize: params.pageSize,
			search: params.search || undefined,
			role: params.role || undefined,
			emailVerified: params.emailVerified || undefined,
			isApproved: params.isApproved || undefined,
			fromDate: params.fromDate || undefined,
			toDate: params.toDate || undefined,
			sort: params.sort,
			dir: params.dir
		}),
		[
			params.dir,
			params.emailVerified,
			params.isApproved,
			params.fromDate,
			params.page,
			params.pageSize,
			params.role,
			params.search,
			params.sort,
			params.toDate
		]
	);
	const usersQuery = useUsersQuery(filters);
	const pagination = usersQuery.data ?? defaultPagination;

	const handleSorting = useCallback(
		(nextSort: string, nextDir: UserSortDirection) => {
			if (!sortableUserColumns.has(nextSort)) return;

			void setParams({ sort: nextSort as UserSort, dir: nextDir, page: 1 });
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

	const handleEmailVerifiedChange = useCallback(
		(value: string) => {
			void setParams({ emailVerified: value || null, page: 1 });
		},
		[setParams]
	);

	const handleIsApprovedChange = useCallback(
		(value: string) => {
			void setParams({ isApproved: value || null, page: 1 });
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
			role: null,
			emailVerified: null,
			isApproved: null,
			fromDate: null,
			toDate: null,
			sort: "createdAt",
			dir: "desc"
		});
	}, [setParams]);

	const handleRefresh = useCallback(() => {
		void toast.promise(usersQuery.refetch(), {
			loading: "Refreshing users...",
			success: "Users refreshed",
			error: "Failed to refresh users"
		});
	}, [usersQuery]);

	const value = useMemo<UserListContextValue>(
		() => ({
			tableData: pagination.rows,
			pagination: {
				rows: pagination.rows,
				total: pagination.total,
				page: pagination.page,
				pageSize: pagination.pageSize
			},
			isLoading: usersQuery.isLoading,
			isFetching: usersQuery.isFetching,
			error: usersQuery.error,
			search: params.search,
			role: params.role,
			emailVerified: params.emailVerified,
			isApproved: params.isApproved,
			fromDate: params.fromDate,
			toDate: params.toDate,
			sort: params.sort,
			dir: params.dir,
			handleSorting,
			handleOptionFilter,
			handleSearchChange,
			handleEmailVerifiedChange,
			handleIsApprovedChange,
			handleDateRangeChange,
			handleResetAll,
			handleRefresh
		}),
		[
			handleDateRangeChange,
			handleEmailVerifiedChange,
			handleIsApprovedChange,
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
			params.emailVerified,
			params.isApproved,
			params.fromDate,
			params.role,
			params.search,
			params.sort,
			params.toDate,
			usersQuery.error,
			usersQuery.isFetching,
			usersQuery.isLoading
		]
	);

	return <UserListContext.Provider value={value}>{children}</UserListContext.Provider>;
}

export function useUserList() {
	const context = useContext(UserListContext);

	if (!context) {
		throw new Error("useUserList must be used within UserListProvider");
	}

	return context;
}

