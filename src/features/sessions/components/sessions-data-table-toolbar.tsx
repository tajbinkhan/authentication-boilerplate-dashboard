"use client";
import { Cancel01Icon, ComputerRemoveIcon, RefreshIcon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import { DataTableDateRangeFilter } from "@/components/common/table/data-table-date-range-filter";
import { DataTableMultiSelectFacetedFilter } from "@/components/common/table/data-table-multi-select-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useSessionList } from "@/features/sessions/hooks/use-session-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface SessionsDataTableToolbarProps<TData> {
	table: Table<TData>;
	activeOtherSessionCount: number;
	isRefreshing: boolean;
	isRevokeOtherSessionsPending: boolean;
	onRefresh: () => void;
	onRevokeOtherSessions: () => void;
}

const sessionStatusFilterOptions = [
	{ label: "Active", value: "active" },
	{ label: "Revoked", value: "revoked" },
	{ label: "Expired", value: "expired" }
];

const sessionDeviceTypeFilterOptions = [
	{ label: "Desktop", value: "desktop" },
	{ label: "Mobile", value: "mobile" },
	{ label: "Tablet", value: "tablet" },
	{ label: "Unknown", value: "Unknown" }
];

export function SessionsDataTableToolbar<TData>({
	table,
	activeOtherSessionCount,
	isRefreshing,
	isRevokeOtherSessionsPending,
	onRefresh,
	onRevokeOtherSessions
}: SessionsDataTableToolbarProps<TData>) {
	const {
		search,
		status,
		deviceType,
		fromDate,
		toDate,
		handleSearchChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleResetAll
	} = useSessionList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const disabled = activeOtherSessionCount === 0 || isRevokeOtherSessionsPending;
	const hasFilters = Boolean(search || status || deviceType || fromDate || toDate);

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
							id="sessions-search"
							value={searchInput}
							placeholder="Search sessions..."
							onChange={event => setSearchInput(event.target.value)}
							className="pl-9"
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							{searchInput && (
								<AiFillCloseCircle className="cursor-pointer" onClick={handleClearSearch} />
							)}
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="flex flex-row items-center gap-2">
					<DataTableMultiSelectFacetedFilter
						title="Status"
						queryParameter="status"
						options={sessionStatusFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableMultiSelectFacetedFilter
						title="Device"
						queryParameter="deviceType"
						options={sessionDeviceTypeFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					{hasFilters ? (
						<Button type="button" variant="ghost" onClick={handleResetFilters}>
							Reset
							<HugeiconsIcon icon={Cancel01Icon} />
						</Button>
					) : null}
				</div>
			</div>
			<div className="flex flex-col gap-2 sm:items-end">
				<DataTableDateRangeFilter
					id="sessions-date-range"
					fromDate={fromDate}
					toDate={toDate}
					onChange={handleDateRangeChange}
				/>
				<div className="flex flex-wrap items-center gap-2 sm:justify-end">
					<Button type="button" size="sm" onClick={onRefresh} disabled={isRefreshing}>
						<HugeiconsIcon
							icon={RefreshIcon}
							data-icon="inline-start"
							className={isRefreshing ? "animate-spin" : undefined}
						/>
						Refresh
					</Button>
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button type="button" variant="outline" disabled={disabled} size="sm">
								<HugeiconsIcon icon={ComputerRemoveIcon} data-icon="inline-start" />
								Revoke other sessions
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogMedia>
									<HugeiconsIcon icon={ComputerRemoveIcon} />
								</AlertDialogMedia>
								<AlertDialogTitle>Revoke other sessions?</AlertDialogTitle>
								<AlertDialogDescription>
									This will sign out {activeOtherSessionCount} other active session
									{activeOtherSessionCount === 1 ? "" : "s"}. Your current session will stay active.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction variant="destructive" onClick={onRevokeOtherSessions}>
									Revoke others
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</div>
	);
}

