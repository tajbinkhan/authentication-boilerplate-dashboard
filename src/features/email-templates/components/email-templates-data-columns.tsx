"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { EmailTemplate } from "@/features/email-templates/types/email-template.types";
import { formatEmailTemplateDate } from "@/features/email-templates/utils/email-template-format";

import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { route } from "@/routes/routes";

interface EmailTemplateColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createEmailTemplateColumns({
	sort,
	dir,
	handleSorting
}: EmailTemplateColumnsOptions): ColumnDef<EmailTemplate>[] {
	return [
		{
			accessorKey: "key",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Template Key"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<div className="min-w-0">
					<div className="truncate font-medium">{row.original.key}</div>
					<div className="text-muted-foreground truncate text-xs">v{row.original.version}</div>
				</div>
			)
		},
		{
			accessorKey: "subject",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Subject"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<div className="max-w-xs truncate">{row.original.subject}</div>
			)
		},
		{
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Active"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant={row.original.isActive ? "default" : "outline"}>
					{row.original.isActive ? "Active" : "Inactive"}
				</Badge>
			)
		},
		{
			accessorKey: "updatedAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Updated"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatEmailTemplateDate(row.original.updatedAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <EmailTemplateRowActions template={row.original} />
		}
	];
}

function EmailTemplateRowActions({ template }: { template: EmailTemplate }) {
	const router = useRouter();

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			onClick={() => router.push(route.private.emailTemplateEdit(template.publicId))}
			aria-label={`Edit template ${template.key}`}
		>
			<HugeiconsIcon icon={Edit02Icon} />
		</Button>
	);
}
