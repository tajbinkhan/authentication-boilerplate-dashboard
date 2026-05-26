"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { EmailLog } from "@/features/email-logs/types/email-log.types";
import {
	formatEmailLogDate,
	formatEmailLogStatus,
	formatEmailLogSubject,
	formatEmailLogTemplateKey
} from "@/features/email-logs/utils/email-log-format";

import { EmailLogDataTableRowActions } from "./email-log-data-table-row-actions";

interface EmailLogColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createEmailLogColumns({
	sort,
	dir,
	handleSorting
}: EmailLogColumnsOptions): ColumnDef<EmailLog>[] {
	return [
		{
			accessorKey: "toEmail",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Recipient"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<div className="min-w-0">
					<div className="truncate font-medium">{row.original.toEmail}</div>
					{row.original.toName ? (
						<div className="text-muted-foreground truncate text-xs">{row.original.toName}</div>
					) : null}
				</div>
			)
		},
		{
			accessorKey: "subject",
			enableSorting: false,
			header: "Subject",
			cell: ({ row }) => (
				<span className="text-muted-foreground block max-w-64 truncate">
					{formatEmailLogSubject(row.original.subject)}
				</span>
			)
		},
		{
			accessorKey: "templateKey",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Template"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant="outline">
					{formatEmailLogTemplateKey(row.original.templateKey)}
				</Badge>
			)
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Status"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<StatusBadge status={row.original.status} />
			)
		},
		{
			accessorKey: "errorMessage",
			enableSorting: false,
			header: "Error",
			cell: ({ row }) =>
				row.original.status === "failed" && row.original.errorMessage ? (
					<span className="text-destructive block max-w-56 truncate text-xs">
						{row.original.errorMessage}
					</span>
				) : (
					<span className="text-muted-foreground text-xs">—</span>
				)
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Sent"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatEmailLogDate(row.original.createdAt)
		},
		{
			id: "actions",
			enableSorting: false,
			header: "Actions",
			cell: ({ row }) => <EmailLogDataTableRowActions log={row.original} />
		}
	];
}

function StatusBadge({ status }: { status: string }) {
	const variant =
		status === "sent"
			? "default"
			: status === "failed"
				? "destructive"
				: "secondary";

	return <Badge variant={variant}>{formatEmailLogStatus(status)}</Badge>;
}
