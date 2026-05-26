"use client";

import { Cancel01Icon, Mail01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
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

import { useSmtpProviderList } from "@/features/smtp-providers/hooks/use-smtp-provider-list";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface SmtpProvidersDataTableToolbarProps<TData> {
	table: Table<TData>;
}

const providerTypeFilterOptions = [
	{ label: "Brevo", value: "brevo" },
	{ label: "Resend", value: "resend" },
	{ label: "SMTP (Nodemailer)", value: "nodemailer" },
	{ label: "AWS SES", value: "aws-ses" }
];

const activeStatusFilterOptions = [
	{ label: "Active", value: "true" },
	{ label: "Inactive", value: "false" }
];

export function SmtpProvidersDataTableToolbar<TData>({
	table
}: SmtpProvidersDataTableToolbarProps<TData>) {
	const {
		search,
		providerType,
		isActive,
		fromDate,
		toDate,
		handleSearchChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleResetAll,
		handleRefresh,
		isFetching
	} = useSmtpProviderList();
	const [searchInput, setSearchInput] = useState(search);
	const debouncedSearch = useDebouncedValue(searchInput, 400);

	const hasFilters = Boolean(search || providerType || isActive || fromDate || toDate);

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
							id="smtp-providers-search"
							value={searchInput}
							placeholder="Search providers..."
							onChange={event => setSearchInput(event.target.value)}
							className="pl-9"
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Mail01Icon} data-icon="inline-start" />
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
						title="Type"
						queryParameter="providerType"
						options={providerTypeFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableMultiSelectFacetedFilter
						title="Status"
						queryParameter="isActive"
						options={activeStatusFilterOptions}
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
						id="smtp-providers-date-range"
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
