"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { Session, SessionStatus } from "@/features/sessions/types/sessions.types";
import { formatSessionDate, getSessionDeviceIcon } from "@/features/sessions/utils/session-format";

import { SessionDataTableRowActions } from "./session-data-table-row-actions";

const statusLabels: Record<SessionStatus, string> = {
	active: "Active",
	revoked: "Revoked",
	expired: "Expired"
};

interface SessionColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createSessionColumns({
	sort,
	dir,
	handleSorting
}: SessionColumnsOptions): ColumnDef<Session>[] {
	return [
		{
			accessorKey: "deviceName",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Device"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <SessionDeviceCell session={row.original} />
		},
		{
			accessorKey: "ipAddress",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="IP address"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			)
		},
		{
			accessorKey: "userAgent",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="User agent"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <span className="max-w-56 truncate">{row.original.userAgent}</span>
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Logged in"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatSessionDate(row.original.createdAt)
		},
		{
			accessorKey: "expiresAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Expires"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => formatSessionDate(row.original.expiresAt)
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
				<div className="flex items-center gap-2">
					<SessionStatusBadge status={row.original.status} />
					{row.original.isCurrent ? <Badge variant="outline">Current</Badge> : null}
				</div>
			)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <SessionDataTableRowActions session={row.original} />
		}
	];
}

function SessionDeviceCell({ session }: { session: Session }) {
	return (
		<div className="flex min-w-0 items-center gap-3">
			<div className="bg-muted text-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
				<HugeiconsIcon icon={getSessionDeviceIcon(session.deviceType)} className="size-5" />
			</div>
			<div className="min-w-0">
				<div className="truncate font-medium">{session.deviceName}</div>
				<div className="text-muted-foreground truncate text-xs capitalize">
					{session.deviceType}
				</div>
			</div>
		</div>
	);
}

function SessionStatusBadge({ status }: { status: SessionStatus }) {
	const variant =
		status === "active" ? "default" : status === "revoked" ? "destructive" : "secondary";

	return <Badge variant={variant}>{statusLabels[status]}</Badge>;
}
