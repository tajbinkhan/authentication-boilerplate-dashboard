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
import { useAuditLogFilterOptions } from "@/features/audit-logs/actions/audit-logs.queries";
import { useAuditLogList } from "@/features/audit-logs/hooks/use-audit-log-list";
import { formatAuditAction, formatAuditTargetType } from "@/features/audit-logs/utils/audit-log-format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

interface AuditLogsDataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function AuditLogsDataTableToolbar<TData>({ table }: AuditLogsDataTableToolbarProps<TData>) {
	const {
		actor,
		action,
		targetType,
		fromDate,
		toDate,
		isFetching,
		handleActorChange,
		handleDateRangeChange,
		handleOptionFilter,
		handleResetAll,
		handleRefresh
	} = useAuditLogList();
	const { data: filterOptions } = useAuditLogFilterOptions();
	const [actorInput, setActorInput] = useState(actor);
	const debouncedActor = useDebouncedValue(actorInput, 400);

	const actionFilterOptions = useMemo(
		() =>
			(filterOptions?.actions ?? []).map(value => ({
				label: formatAuditAction(value),
				value
			})),
		[filterOptions?.actions]
	);

	const targetTypeFilterOptions = useMemo(
		() =>
			(filterOptions?.targetTypes ?? []).map(value => ({
				label: formatAuditTargetType(value),
				value
			})),
		[filterOptions?.targetTypes]
	);

	const hasFilters = Boolean(actor || action || targetType || fromDate || toDate);

	useEffect(() => {
		if (debouncedActor === actor) return;

		handleActorChange(debouncedActor);
	}, [actor, debouncedActor, handleActorChange]);

	const handleClearActor = () => {
		setActorInput("");
		handleActorChange("");
	};

	const handleResetFilters = () => {
		setActorInput("");
		handleResetAll();
	};

	return (
		<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
			<div className="flex flex-col gap-3 lg:flex-row lg:items-end">
				<Field className="gap-1 sm:max-w-96">
					<InputGroup className="h-8 max-w-sm">
						<InputGroupInput
							id="audit-logs-actor"
							value={actorInput}
							placeholder="Search by name or email..."
							onChange={event => setActorInput(event.target.value)}
						/>
						<InputGroupAddon>
							<HugeiconsIcon icon={Search} data-icon="inline-start" />
						</InputGroupAddon>
						<InputGroupAddon align="inline-end">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className={actorInput ? "size-6" : "invisible size-6"}
								onClick={handleClearActor}
							>
								<span className="sr-only">Clear actor search</span>
								<HugeiconsIcon icon={CancelCircleIcon} />
							</Button>
						</InputGroupAddon>
					</InputGroup>
				</Field>
				<div className="flex flex-row items-center gap-2">
					<DataTableSingleSelectFacetedFilter
						title="Action"
						queryParameter="action"
						options={actionFilterOptions}
						onValueChange={() => handleOptionFilter("page", "1")}
					/>
					<DataTableSingleSelectFacetedFilter
						title="Target"
						queryParameter="targetType"
						options={targetTypeFilterOptions}
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
						id="audit-logs-date-range"
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

