"use client";

import { Cancel01Icon, CancelCircleIcon, RefreshIcon, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { DataTableDateRangeFilter } from "@/components/common/table/data-table-date-range-filter";
import { DataTableSingleSelectFacetedFilter } from "@/components/common/table/data-table-single-select-faceted-filter";
import { DataTableViewOptions } from "@/components/common/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useEmailLogList } from "@/features/email-logs/hooks/use-email-log-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface EmailLogsDataTableToolbarProps<TData> {
	table: Table<TData>;
}

const statusFilterOptions = [
	{ label: "Sent", value: "sent" },
	{ label: "Failed", value: "failed" }
];

const templateFilterOptions = [
	{ label: "Auth Magic Link", value: "auth_magic_link" },
	{ label: "Auth Welcome", value: "auth_welcome" },
	{ label: "Auth Account Approval", value: "auth_account_approval" },
	{ label: "Auth Invitation", value: "auth_invitation" },
	{ label: "Auth Two Factor Alert", value: "auth_two_factor_alert" }
];

export function EmailLogsDataTableToolbar<TData>({ table }: EmailLogsDataTableToolbarProps<TData>) {
	const {
		providerId,
		toEmail,
		status,
		templateKey,
		fromDate,
		toDate,
		isFetching,
		providersQuery,
		handleToEmailChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleStatusFilter,
		handleResetAll,
		handleRefresh
	} = useEmailLogList();

	const providerFilterOptions = useMemo(
		() =>
			(providersQuery.data?.rows ?? []).map(provider => ({
				label: provider.name,
				value: provider.id
			})),
		[providersQuery.data?.rows]
	);

	const [toEmailInput, setToEmailInput] = useState(toEmail);
	const debouncedToEmail = useDebouncedValue(toEmailInput, 400);

	const hasFilters = Boolean(providerId || toEmail || status || templateKey || fromDate || toDate);

	useEffect(() => {
		if (debouncedToEmail === toEmail) return;
		handleToEmailChange(debouncedToEmail);
	}, [toEmail, debouncedToEmail, handleToEmailChange]);

	const handleClearToEmail = () => {
		setToEmailInput("");
		handleToEmailChange("");
	};

	const handleResetFilters = () => {
		setToEmailInput("");
		handleResetAll();
	};

	return (
		<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end">
				<Field className="gap-1 sm:max-w-96">
					<InputGroup className="h-8 max-w-sm">
						<InputGroupInput
							id="email-logs-to-email"
							value={toEmailInput}
							placeholder="Search by recipient email..."
							onChange={event => setToEmailInput(event.target.value)}
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className={toEmailInput ? "size-6" : "invisible size-6"}
								onClick={handleClearToEmail}
							>
								<span className="sr-only">Clear email search</span>
								<HugeiconsIcon icon={CancelCircleIcon} />
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="flex flex-row items-center gap-2">
					<DataTableSingleSelectFacetedFilter
						title="Provider"
						queryParameter="providerId"
						options={providerFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableSingleSelectFacetedFilter
						title="Status"
						queryParameter="status"
						options={statusFilterOptions}
						onValueChange={value => {
							const statusValue = Array.isArray(value) ? value[0] : value;
							handleStatusFilter(statusValue as "sent" | "failed" | undefined);
						}}
					/>
					<DataTableSingleSelectFacetedFilter
						title="Template"
						queryParameter="templateKey"
						options={templateFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					{hasFilters ? (
						<Button type="button" variant="ghost" size="sm" onClick={handleResetFilters}>
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
						id="email-logs-date-range"
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
