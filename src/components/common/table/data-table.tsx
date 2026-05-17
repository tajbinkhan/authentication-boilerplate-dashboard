"use client";

import { SearchRemoveIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type Table as TableInstance,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/components/common/table/data-table-pagination";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	isLoading: boolean;
	data: TData[];
	pagination: PaginatedData<TData>;
	selectedCount?: number;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	DataTableToolbar: React.ComponentType<{ table: TableInstance<TData> }>;
	emptyTitle?: string;
	emptyDescription?: string;
	rowDetailsTitle?: string;
	rowDetailsDescription?: string;
	renderRowDetails?: (row: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	isLoading,
	data,
	pagination,
	selectedCount = 0,
	handleOptionFilter,
	DataTableToolbar,
	emptyTitle = "No results found",
	emptyDescription = "Try adjusting your filters.",
	rowDetailsTitle = "Details",
	rowDetailsDescription = "Full item details",
	renderRowDetails
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [activeRow, setActiveRow] = React.useState<TData | null>(null);

	React.useEffect(() => {
		if (selectedCount === 0 && Object.keys(rowSelection).length > 0) {
			setRowSelection({});
		}
	}, [selectedCount, rowSelection]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	const shouldIgnoreRowClick = (target: EventTarget | null) => {
		if (!(target instanceof HTMLElement)) {
			return false;
		}

		return Boolean(
			target.closest(
				"button, a, input, textarea, select, option, label, [role='button'], [data-no-row-click='true']"
			)
		);
	};

	const visibleColumnCount = Math.max(table.getVisibleLeafColumns().length, 1);

	return (
		<div className="space-y-4">
			<DataTableToolbar table={table} />
			<div className="overflow-hidden rounded-xl border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<DataTableSkeletonRows
								columnCount={visibleColumnCount}
								rowCount={Math.min(pagination.pageSize || 6, 8)}
							/>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={renderRowDetails ? "group cursor-pointer" : "group"}
									onClick={event => {
										if (!renderRowDetails || shouldIgnoreRowClick(event.target)) {
											return;
										}

										setActiveRow(row.original);
									}}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={visibleColumnCount} className="h-48">
									<Empty className="border-0">
										<EmptyHeader>
											<EmptyMedia variant="icon">
												<HugeiconsIcon icon={SearchRemoveIcon} />
											</EmptyMedia>
											<EmptyTitle>{emptyTitle}</EmptyTitle>
											<EmptyDescription>{emptyDescription}</EmptyDescription>
										</EmptyHeader>
									</Empty>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination
				table={table}
				pagination={pagination}
				selectedCount={selectedCount}
				handleOptionFilter={handleOptionFilter}
			/>
			{renderRowDetails && (
				<Dialog
					open={Boolean(activeRow)}
					onOpenChange={isOpen => {
						if (!isOpen) {
							setActiveRow(null);
						}
					}}
				>
					<DialogContent className="sm:max-w-2xl">
						<DialogHeader>
							<DialogTitle>{rowDetailsTitle}</DialogTitle>
							<DialogDescription>{rowDetailsDescription}</DialogDescription>
						</DialogHeader>
						<div className="max-h-[70vh] overflow-y-auto px-0 md:px-0">
							{activeRow ? renderRowDetails(activeRow) : null}
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Close</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}

function DataTableSkeletonRows({
	columnCount,
	rowCount
}: {
	columnCount: number;
	rowCount: number;
}) {
	return (
		<>
			{Array.from({ length: rowCount }).map((_, rowIndex) => (
				<TableRow key={rowIndex}>
					{Array.from({ length: columnCount }).map((__, cellIndex) => (
						<TableCell key={`${rowIndex}-${cellIndex}`}>
							<Skeleton
								className={
									cellIndex === columnCount - 1 ? "ml-auto h-5 w-24" : "h-5 w-full max-w-48"
								}
							/>
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}
