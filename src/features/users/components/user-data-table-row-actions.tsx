"use client";

import {
	ComputerRemoveIcon,
	Delete02Icon,
	EyeIcon,
	LockKeyIcon,
	MoreVerticalIcon,
	ShieldBanIcon,
	Tick02Icon,
	UserEdit01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserDetailsDialog } from "@/features/users/components/user-details-dialog";
import { UserDeleteDialog } from "@/features/users/components/user-delete-dialog";
import { UserEditDialog } from "@/features/users/components/user-edit-dialog";
import { UserResetTwoFactorDialog } from "@/features/users/components/user-reset-two-factor-dialog";
import { UserRevokeSessionsDialog } from "@/features/users/components/user-revoke-sessions-dialog";
import { UserRoleDialog } from "@/features/users/components/user-role-dialog";
import { useUserActions } from "@/features/users/hooks/use-user-actions";
import type { ManagedUser } from "@/features/users/types/users.types";

interface UserDataTableRowActionsProps {
	user: ManagedUser;
}

export function UserDataTableRowActions({ user }: UserDataTableRowActionsProps) {
	const actions = useUserActions(user);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`Open actions for ${user.email}`}
					>
						<HugeiconsIcon icon={MoreVerticalIcon} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						disabled={!actions.manageable}
						onSelect={event => {
							event.preventDefault();
							actions.setDetailsDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={EyeIcon} />
						View details
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						disabled={!actions.manageable}
						onSelect={event => {
							event.preventDefault();
							actions.resetEditForm();
							actions.setEditDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Edit user
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={!actions.manageable}
						onSelect={event => {
							event.preventDefault();
							actions.setNextRole(user.role);
							actions.setRoleDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Change role
					</DropdownMenuItem>
					{actions.manageable && !user.isApproved && (
						<DropdownMenuItem
							onSelect={event => {
								event.preventDefault();
								actions.handleToggleApproval(true);
							}}
						>
							<HugeiconsIcon icon={Tick02Icon} />
							Approve user
						</DropdownMenuItem>
					)}
					{actions.manageable && user.isApproved && (
						<DropdownMenuItem
							onSelect={event => {
								event.preventDefault();
								actions.handleToggleApproval(false);
							}}
						>
							<HugeiconsIcon icon={ShieldBanIcon} />
							Revoke approval
						</DropdownMenuItem>
					)}
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={!actions.manageable || !user.is2faEnabled}
						onSelect={event => {
							event.preventDefault();
							actions.setResetTwoFactorDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={LockKeyIcon} />
						Reset 2FA
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						disabled={!actions.manageable || user.activeSessionCount === 0}
						onSelect={event => {
							event.preventDefault();
							actions.setRevokeDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={ComputerRemoveIcon} />
						Revoke sessions
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						disabled={!actions.manageable}
						onSelect={event => {
							event.preventDefault();
							actions.setDeleteDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={Delete02Icon} />
						Delete user
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<UserDetailsDialog
				user={user}
				open={actions.detailsDialogOpen}
				onOpenChange={actions.setDetailsDialogOpen}
			/>

			<UserEditDialog user={user} actions={actions} />
			<UserRoleDialog user={user} actions={actions} />
			<UserRevokeSessionsDialog user={user} actions={actions} />
			<UserResetTwoFactorDialog user={user} actions={actions} />
			<UserDeleteDialog user={user} actions={actions} />
		</>
	);
}
