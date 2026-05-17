"use client";

import { PlusSignCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { useMemo, type ComponentType } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableMultiSelectFacetedFilterProps {
	title?: string;
	queryParameter: string;
	onValueChange?: (value: string | null) => void;
	options:
		| {
				label: string;
				value: string;
				icon?: ComponentType<{ className?: string }>;
		  }[]
		| undefined;
}

export function DataTableMultiSelectFacetedFilter({
	title,
	queryParameter,
	onValueChange,
	options
}: DataTableMultiSelectFacetedFilterProps) {
	const [queryValue, setQueryValue] = useQueryState(queryParameter, {
		parse: value => value ?? null
	});

	const selectedValues = useMemo(() => {
		return queryValue ? queryValue.split(",").filter(Boolean) : [];
	}, [queryValue]);

	const handleSelect = (value: string) => {
		if (selectedValues.includes(value)) {
			const filteredValues = selectedValues.filter(selectedValue => selectedValue !== value);
			const nextValue = filteredValues.length > 0 ? filteredValues.join(",") : null;
			void setQueryValue(nextValue);
			onValueChange?.(nextValue);
			return;
		}

		const nextValue = [...selectedValues, value].join(",");
		void setQueryValue(nextValue);
		onValueChange?.(nextValue);
	};

	const handleClearFilter = () => {
		void setQueryValue(null);
		onValueChange?.(null);
	};

	const hasSelectedValues =
		selectedValues.length > 0 &&
		Boolean(options?.some(option => selectedValues.includes(option.value)));

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<HugeiconsIcon icon={PlusSignCircleIcon} />
					{title}
					{hasSelectedValues ? (
						<>
							<Separator
								orientation="vertical"
								className="mx-2 self-center! data-[orientation=vertical]:h-4"
							/>
							<Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
								{selectedValues.length}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{selectedValues.length > 2 ? (
									<Badge variant="secondary" className="rounded-sm px-1 font-normal">
										{selectedValues.length} selected
									</Badge>
								) : (
									options
										?.filter(option => selectedValues.includes(option.value))
										.map(option => (
											<Badge
												variant="secondary"
												key={option.value}
												className="rounded-sm px-1 font-normal"
											>
												{option.label}
											</Badge>
										))
								)}
							</div>
						</>
					) : null}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty>No results found.</CommandEmpty>
						<CommandGroup>
							{options?.map(option => {
								const isSelected = selectedValues.includes(option.value);

								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											handleSelect(option.value);
										}}
									>
										<div
											className={cn(
												"border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
												isSelected
													? "bg-primary text-primary-foreground"
													: "opacity-50 [&_svg]:invisible"
											)}
										>
											<HugeiconsIcon icon={Tick02Icon} />
										</div>
										<span>{option.label}</span>
									</CommandItem>
								);
							})}
						</CommandGroup>
						{hasSelectedValues ? (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem onSelect={handleClearFilter} className="justify-center text-center">
										Clear filters
									</CommandItem>
								</CommandGroup>
							</>
						) : null}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
