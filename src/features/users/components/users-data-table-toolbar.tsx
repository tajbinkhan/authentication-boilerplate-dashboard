"use client";

import { Cancel01Icon, RefreshIcon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import { DataTableDateRangeFilter } from "@/components/common/table/data-table-date-range-filter";
import { DataTableMultiSelectFacetedFilter } from "@/components/common/table/data-table-multi-select-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { DataTableSingleSelectFacetedFilter } from "@/components/common/table/data-table-single-select-faceted-filter";
import { useUserList } from "@/features/users/hooks/use-user-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

interface UsersDataTableToolbarProps<TData> {
	table: Table<TData>;
}

const userRoleFilterOptions = [
	{ label: "Super Admin", value: "SUPER_ADMIN" },
	{ label: "Admin", value: "ADMIN" },
	{ label: "Manager", value: "MANAGER" },
	{ label: "User", value: "USER" }
];

export function UsersDataTableToolbar<TData>({ table }: UsersDataTableToolbarProps<TData>) {
	const {
		search,
		role,
		emailVerified,
		isApproved,
		fromDate,
		toDate,
		isFetching,
		handleSearchChange,
		handleEmailVerifiedChange,
		handleIsApprovedChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleResetAll,
		handleRefresh
	} = useUserList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const hasFilters = Boolean(search || role || emailVerified || isApproved || fromDate || toDate);

	useEffect(() => {
		if (debouncedSearch === search) return;

		handleSearchChange(debouncedSearch);
	}, [debouncedSearch, handleSearchChange, search]);

	const handleClearSearch = () => {
		setSearchInput("");
		handleSearchChange("");
	};

	const handleResetFilters = () => {
		setSearchInput("");
		handleResetAll();
	};

	return (
		<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end">
				<Field className="gap-1 sm:max-w-72">
					<InputGroup className="h-8 max-w-xs">
						<InputGroupInput
							id="users-search"
							value={searchInput}
							placeholder="Search users..."
							onChange={event => setSearchInput(event.target.value)}
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<AiFillCloseCircle
								className={cn("cursor-pointer", !searchInput && "invisible")}
								onClick={handleClearSearch}
							/>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="flex flex-row items-center gap-2">
					<DataTableMultiSelectFacetedFilter
						title="Role"
						queryParameter="role"
						options={userRoleFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableSingleSelectFacetedFilter
						title="Email Verified"
						queryParameter="emailVerified"
						options={[
							{ label: "Verified", value: "true" },
							{ label: "Unverified", value: "false" }
						]}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableSingleSelectFacetedFilter
						title="Status"
						queryParameter="isApproved"
						options={[
							{ label: "Approved", value: "true" },
							{ label: "Pending", value: "false" }
						]}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>

					{hasFilters ? (
						<Button type="button" variant="ghost" size={"sm"} onClick={handleResetFilters}>
							Reset
							<HugeiconsIcon icon={Cancel01Icon} />
						</Button>
					) : null}
				</div>
			</div>
			<div className="flex flex-col gap-2 sm:items-end">
				<div className="flex flex-wrap items-center gap-2 sm:justify-end">
					<Button type="button" size="sm" onClick={handleRefresh} disabled={isFetching}>
						<HugeiconsIcon
							icon={RefreshIcon}
							data-icon="inline-start"
							className={isFetching ? "animate-spin" : undefined}
						/>
						Refresh
					</Button>
					<DataTableDateRangeFilter
						id="users-date-range"
						fromDate={fromDate}
						toDate={toDate}
						onChange={handleDateRangeChange}
					/>
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</div>
	);
}

