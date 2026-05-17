"use client";

import { PlusSignCircleIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQueryState } from "nuqs";
import { type ComponentType } from "react";

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

interface DataTableSingleSelectFacetedFilterProps {
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

export function DataTableSingleSelectFacetedFilter({
	title,
	queryParameter,
	onValueChange,
	options
}: DataTableSingleSelectFacetedFilterProps) {
	const [queryValue, setQueryValue] = useQueryState(queryParameter, {
		parse: value => value ?? null
	});

	const selectedOption = options?.find(option => option.value === queryValue) ?? null;

	const handleSelect = (value: string) => {
		// Clicking the already-selected option deselects it
		const nextValue = queryValue === value ? null : value;
		void setQueryValue(nextValue);
		onValueChange?.(nextValue);
	};

	const handleClearFilter = () => {
		void setQueryValue(null);
		onValueChange?.(null);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-8 border-dashed">
					<HugeiconsIcon icon={PlusSignCircleIcon} />
					{title}
					{selectedOption ? (
						<>
							<Separator
								orientation="vertical"
								className="mx-2 self-center! data-[orientation=vertical]:h-4"
							/>
							<Badge variant="secondary" className="rounded-sm px-1 font-normal">
								{selectedOption.label}
							</Badge>
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
								const isSelected = queryValue === option.value;

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
						{selectedOption ? (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem onSelect={handleClearFilter} className="justify-center text-center">
										Clear filter
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
