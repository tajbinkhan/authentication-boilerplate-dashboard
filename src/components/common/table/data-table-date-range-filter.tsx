"use client";

import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { formatDateRange } from "little-date";
import { useId, useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DataTableDateRangeFilterProps {
	id?: string;
	label?: string;
	placeholder?: string;
	fromDate?: string;
	toDate?: string;
	className?: string;
	align?: "start" | "center" | "end";
	numberOfMonths?: number;
	onChange: (value: { fromDate?: string; toDate?: string }) => void;
}

export function DataTableDateRangeFilter({
	id,
	label,
	placeholder = "Select date range",
	fromDate = "",
	toDate = "",
	className,
	align = "end",
	numberOfMonths = 2,
	onChange
}: DataTableDateRangeFilterProps) {
	const [open, setOpen] = useState(false);
	const [draftRange, setDraftRange] = useState<DateRange | undefined>();
	const fallbackId = useId();

	const selectedRange = useMemo<DateRange | undefined>(
		() =>
			fromDate || toDate
				? {
						from: parseDateParam(fromDate),
						to: parseDateParam(toDate)
					}
				: undefined,
		[fromDate, toDate]
	);

	const triggerId = id ?? `data-table-date-range-${fallbackId}`;

	const labelText = useMemo(() => {
		const from = parseDateParam(fromDate);
		const to = parseDateParam(toDate);
		if (from && to) return formatDateRange(from, to, { includeTime: false });
		if (from) return `${format(from, "MMM d, yyyy")} - Select end`;
		if (to) return `Until ${format(to, "MMM d, yyyy")}`;
		return placeholder;
	}, [fromDate, toDate, placeholder]);

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (nextOpen) {
			setDraftRange(selectedRange);
		}
	};

	const handleSelect = (range?: DateRange) => {
		setDraftRange(range);

		if (!range?.from || !range.to) return;
		if (range.from.getTime() === range.to.getTime()) return;

		onChange({
			fromDate: formatDateParam(range.from),
			toDate: formatDateParam(range.to)
		});

		setOpen(false);
	};

	const handleClear = () => {
		setDraftRange(undefined);
		onChange({ fromDate: undefined, toDate: undefined });
		setOpen(false);
	};

	return (
		<Field className={cn("w-full gap-1 sm:w-40", className)}>
			{label ? <FieldLabel htmlFor={triggerId}>{label}</FieldLabel> : null}

			<Popover open={open} onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<Button
						id={triggerId}
						type="button"
						variant="outline"
						size={"sm"}
						className="w-full justify-start"
					>
						<HugeiconsIcon icon={Calendar03Icon} data-icon="inline-start" />
						<span className="truncate">{labelText}</span>
					</Button>
				</PopoverTrigger>

				<PopoverContent className="w-auto p-0" align={align}>
					<Calendar
						mode="range"
						selected={draftRange}
						defaultMonth={draftRange?.from ?? draftRange?.to}
						numberOfMonths={numberOfMonths}
						onSelect={handleSelect}
					/>

					<div className="border-border flex justify-end border-t p-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={!fromDate && !toDate && !draftRange?.from && !draftRange?.to}
							onClick={handleClear}
						>
							Clear
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</Field>
	);
}

function parseDateParam(value: string): Date | undefined {
	if (!value) return undefined;
	const date = new Date(`${value}T00:00:00`);
	return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatDateParam(date: Date): string {
	return format(date, "yyyy-MM-dd");
}

