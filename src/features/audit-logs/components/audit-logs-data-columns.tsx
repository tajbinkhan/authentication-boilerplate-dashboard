"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { AuditLog } from "@/features/audit-logs/types/audit-logs.types";
import {
	formatAuditAction,
	formatAuditDate,
	formatAuditMetadataSummary,
	formatAuditTargetType,
	formatShortId,
	isSystemAuditLog
} from "@/features/audit-logs/utils/audit-log-format";
import { formatUserRole } from "@/features/users/utils/user-format";

interface AuditLogColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createAuditLogColumns({
	sort,
	dir,
	handleSorting
}: AuditLogColumnsOptions): ColumnDef<AuditLog>[] {
	return [
		{
			accessorKey: "action",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Action"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <ActionBadge action={row.original.action} />
		},
		{
			accessorKey: "actorRole",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Actor"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <ActorCell log={row.original} />
		},
		{
			accessorKey: "targetType",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Target"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <TargetCell log={row.original} />
		},
		{
			accessorKey: "ipAddress",
			enableSorting: false,
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="IP address"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => row.original.ipAddress ?? "Unknown"
		},
		{
			accessorKey: "userAgent",
			enableSorting: false,
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="User agent"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<span className="block max-w-56 truncate">{row.original.userAgent ?? "Unknown"}</span>
			)
		},
		{
			id: "metadata",
			enableSorting: false,
			header: "Metadata",
			cell: ({ row }) => (
				<span className="text-muted-foreground block max-w-64 truncate">
					{formatAuditMetadataSummary(row.original)}
				</span>
			)
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Created"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatAuditDate(row.original.createdAt)
		}
	];
}

function ActionBadge({ action }: { action: string }) {
	const variant =
		action === "USER_DELETED" || action === "2FA_RESET"
			? "destructive"
			: action === "USER_CREATED" || action === "LOGIN_SUCCESS"
				? "default"
				: action === "USER_PROVISIONED"
					? "outline"
					: "secondary";

	return <Badge variant={variant}>{formatAuditAction(action)}</Badge>;
}

function ActorCell({ log }: { log: AuditLog }) {
	if (isSystemAuditLog(log)) {
		return (
			<div className="flex flex-col gap-1">
				<Badge variant="secondary">System</Badge>
				<span className="text-muted-foreground text-xs">System event</span>
			</div>
		);
	}

	if (log.actorName || log.actorEmail) {
		return (
			<div className="flex min-w-0 flex-col gap-1">
				<span className="font-medium">{log.actorName ?? "Unknown"}</span>
				<span className="text-muted-foreground text-xs">{log.actorEmail ?? "Unknown email"}</span>
			</div>
		);
	}

	return (
		<div className="flex min-w-0 flex-col gap-1">
			<span className="font-medium">{formatShortId(log.actorId)}</span>
			<span className="text-muted-foreground text-xs">
				{log.actorRole ? formatUserRole(log.actorRole) : "Unknown role"}
			</span>
		</div>
	);
}

function TargetCell({ log }: { log: AuditLog }) {
	return (
		<div className="flex min-w-0 flex-col gap-1">
			<Badge variant="outline">{formatAuditTargetType(log.targetType)}</Badge>
			<span className="text-muted-foreground text-xs">{formatShortId(log.targetId)}</span>
		</div>
	);
}
