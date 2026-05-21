"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/common/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getUserInitials } from "@/core/helper";
import type { ManagedUser, UserRole } from "@/features/users/types/users.types";
import { formatUserDate, formatUserRole } from "@/features/users/utils/user-format";

import { UserDataTableRowActions } from "./user-data-table-row-actions";

interface UserColumnsOptions {
	sort: string;
	dir: "asc" | "desc";
	handleSorting: (sort: string, dir: "asc" | "desc") => void;
}

export function createUserColumns({
	sort,
	dir,
	handleSorting
}: UserColumnsOptions): ColumnDef<ManagedUser>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="User"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <UserIdentityCell user={row.original} />
		},
		{
			accessorKey: "role",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Role"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => <UserRoleBadge role={row.original.role} />
		},
		{
			accessorKey: "isApproved",
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
				row.original.isApproved ? (
					<Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
						Approved
					</Badge>
				) : (
					<Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400">
						Pending
					</Badge>
				)
			)
		},
		{
			accessorKey: "emailVerified",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Email"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant={row.original.emailVerified ? "default" : "secondary"}>
					{row.original.emailVerified ? "Verified" : "Unverified"}
				</Badge>
			)
		},
		{
			accessorKey: "is2faEnabled",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="2FA"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => (
				<Badge variant={row.original.is2faEnabled ? "outline" : "secondary"}>
					{row.original.is2faEnabled ? "Enabled" : "Off"}
				</Badge>
			)
		},
		{
			accessorKey: "activeSessionCount",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					title="Sessions"
					sort={sort}
					dir={dir}
					handleSorting={handleSorting}
				/>
			),
			cell: ({ row }) => row.original.activeSessionCount
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
			cell: ({ row }) => formatUserDate(row.original.createdAt)
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
			cell: ({ row }) => formatUserDate(row.original.updatedAt)
		},
		{
			id: "actions",
			header: "Action",
			cell: ({ row }) => <UserDataTableRowActions user={row.original} />
		}
	];
}

function UserIdentityCell({ user }: { user: ManagedUser }) {
	const displayName = user.name || user.email;

	return (
		<div className="flex min-w-0 items-center gap-3">
			<Avatar className="size-9">
				<AvatarImage src={user.image ?? undefined} alt={displayName} />
				<AvatarFallback>{getUserInitials(displayName)}</AvatarFallback>
			</Avatar>
			<div className="min-w-0">
				<div className="truncate font-medium">{displayName}</div>
				<div className="text-muted-foreground truncate text-xs">{user.email}</div>
				{user.phone ? (
					<div className="text-muted-foreground truncate text-xs">{user.phone}</div>
				) : null}
			</div>
		</div>
	);
}

function UserRoleBadge({ role }: { role: UserRole }) {
	const variant =
		role === "SUPER_ADMIN" ? "destructive" : role === "ADMIN" ? "default" : "secondary";

	return <Badge variant={variant}>{formatUserRole(role)}</Badge>;
}

