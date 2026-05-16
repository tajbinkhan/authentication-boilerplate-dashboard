import {
	ArrowDown01Icon,
	ArrowUp01Icon,
	ArrowUpDownIcon,
	ViewOffIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	title: string;
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	sort,
	dir,
	handleSorting,
	className
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn("text-sm font-normal", className)}>{title}</div>;
	}

	const handleApplySorting = (dir: "asc" | "desc") => {
		handleSorting(column.id, dir);
	};

	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="data-[state=open]:bg-accent -ml-3 h-8">
						<span>{title}</span>
						{sort === column.id && dir === "desc" ? (
							<HugeiconsIcon icon={ArrowDown01Icon} />
						) : sort === column.id && dir === "asc" ? (
							<HugeiconsIcon icon={ArrowUp01Icon} />
						) : (
							<HugeiconsIcon icon={ArrowUpDownIcon} />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => handleApplySorting("asc")}>
						<HugeiconsIcon icon={ArrowUp01Icon} className="text-muted-foreground/70 h-3.5 w-3.5" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleApplySorting("desc")}>
						<HugeiconsIcon
							icon={ArrowDown01Icon}
							className="text-muted-foreground/70 h-3.5 w-3.5"
						/>
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
						<HugeiconsIcon icon={ViewOffIcon} className="text-muted-foreground/70 h-3.5 w-3.5" />
						Hide
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
