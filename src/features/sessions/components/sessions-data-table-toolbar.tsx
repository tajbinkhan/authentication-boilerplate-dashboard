"use client";

import { Cancel01Icon, ComputerRemoveIcon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "@/components/common/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { useSessionList } from "@/features/sessions/context/session-list-context";

interface SessionsDataTableToolbarProps<TData> {
	table: Table<TData>;
	activeOtherSessionCount: number;
	isRefreshing: boolean;
	isRevokeOtherSessionsPending: boolean;
	onRefresh: () => void;
	onRevokeOtherSessions: () => void;
}

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
		handleDateChange,
		handleOptionFilter,
		handleResetAll
	} = useSessionList();
	const disabled = activeOtherSessionCount === 0 || isRevokeOtherSessionsPending;
	const hasFilters = Boolean(search || status || deviceType || fromDate || toDate);

	return (
		<div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
			<div className="flex flex-col gap-3 xl:flex-row xl:items-end">
				<Field className="gap-1 sm:max-w-72">
					<FieldLabel htmlFor="sessions-search">Search</FieldLabel>
					<Input
						id="sessions-search"
						value={search}
						placeholder="Search sessions..."
						onChange={event => handleSearchChange(event.target.value)}
					/>
				</Field>
				<Field className="gap-1">
					<FieldLabel htmlFor="sessions-from-date">From</FieldLabel>
					<Input
						id="sessions-from-date"
						type="date"
						value={fromDate}
						onChange={event => handleDateChange("fromDate", event.target.value)}
					/>
				</Field>
				<Field className="gap-1">
					<FieldLabel htmlFor="sessions-to-date">To</FieldLabel>
					<Input
						id="sessions-to-date"
						type="date"
						value={toDate}
						onChange={event => handleDateChange("toDate", event.target.value)}
					/>
				</Field>
				<div className="flex flex-wrap items-center gap-2">
					<DataTableFacetedFilter
						title="Status"
						queryParameter="status"
						options={sessionStatusFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableFacetedFilter
						title="Device"
						queryParameter="deviceType"
						options={sessionDeviceTypeFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					{hasFilters ? (
						<Button type="button" variant="ghost" onClick={handleResetAll}>
							Reset
							<HugeiconsIcon icon={Cancel01Icon} />
						</Button>
					) : null}
				</div>
			</div>
			<div className="flex flex-wrap items-center gap-2">
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
	);
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
