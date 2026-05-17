import {
	ArrowLeft01Icon,
	ArrowLeftDoubleIcon,
	ArrowRight01Icon,
	ArrowRightDoubleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Table } from "@tanstack/react-table";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

import { useIsMobile } from "@/hooks/use-mobile";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pagination: PaginatedData<TData>;
	selectedCount?: number;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
}

export function DataTablePagination<TData>({
	table,
	pagination,
	selectedCount = 0,
	handleOptionFilter
}: DataTablePaginationProps<TData>) {
	const isMobile = useIsMobile();
	const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

	useEffect(() => {
		table.setPageSize(pagination.pageSize);
	}, [pagination.pageSize, table]);

	const totalPages = Math.ceil(pagination.total / pagination.pageSize);

	if (pagination.total === 0) {
		return null;
	}

	if (isMobile) {
		return (
			<div className="flex flex-col gap-4 px-2 py-3 md:hidden">
				<div className="flex items-center justify-between text-sm">
					<div className="text-muted-foreground">
						{selectedCount} of {pagination.total} row(s) selected.
					</div>
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows</p>
						<Select
							value={`${pagination.pageSize}`}
							onValueChange={value => {
								handleOptionFilter("limit", value);
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-17.5">
								<SelectValue placeholder={pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{PAGE_SIZE_OPTIONS.map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="text-sm font-medium">
						Page {pagination.page} of {totalPages}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handleOptionFilter("page", "1")}
							disabled={pagination.page === 1}
						>
							<HugeiconsIcon icon={ArrowLeftDoubleIcon} />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.page > 1
									? () => handleOptionFilter("page", `${pagination.page - 1}`)
									: undefined
							}
							disabled={pagination.page === 1}
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.page < totalPages
									? () => handleOptionFilter("page", `${pagination.page + 1}`)
									: undefined
							}
							disabled={pagination.page === totalPages || totalPages === 0}
						>
							<HugeiconsIcon icon={ArrowRight01Icon} />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.page < totalPages
									? () => handleOptionFilter("page", `${totalPages}`)
									: undefined
							}
							disabled={pagination.page === totalPages || totalPages === 0}
						>
							<HugeiconsIcon icon={ArrowRightDoubleIcon} />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-muted-foreground flex-1 text-sm">
				{selectedCount > 0
					? `${selectedCount} of ${pagination.total} row(s) selected.`
					: `${pagination.total} total rows.`}
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${pagination.pageSize}`}
						onValueChange={value => {
							handleOptionFilter("limit", value);
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-17.5">
							<SelectValue placeholder={pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{PAGE_SIZE_OPTIONS.map(pageSize => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-25 items-center justify-center text-sm font-medium">
					Page {pagination.page} of {totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handleOptionFilter("page", "1")}
						disabled={pagination.page === 1}
					>
						<span className="sr-only">Go to first page</span>
						<HugeiconsIcon icon={ArrowLeftDoubleIcon} />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={
							pagination.page > 1
								? () => handleOptionFilter("page", `${pagination.page - 1}`)
								: undefined
						}
						disabled={pagination.page === 1}
					>
						<span className="sr-only">Go to previous page</span>
						<HugeiconsIcon icon={ArrowLeft01Icon} />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={
							pagination.page < totalPages
								? () => handleOptionFilter("page", `${pagination.page + 1}`)
								: undefined
						}
						disabled={pagination.page === totalPages || totalPages === 0}
					>
						<span className="sr-only">Go to next page</span>
						<HugeiconsIcon icon={ArrowRight01Icon} />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={
							pagination.page < totalPages
								? () => handleOptionFilter("page", `${totalPages}`)
								: undefined
						}
						disabled={pagination.page === totalPages || totalPages === 0}
					>
						<span className="sr-only">Go to last page</span>
						<HugeiconsIcon icon={ArrowRightDoubleIcon} />
					</Button>
				</div>
			</div>
		</div>
	);
}
