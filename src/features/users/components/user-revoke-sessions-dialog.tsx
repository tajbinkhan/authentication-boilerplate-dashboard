"use client";

import { ShieldBanIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import type { ManagedUser } from "@/features/users/types/users.types";
import type { UseUserActionsReturn } from "@/features/users/hooks/use-user-actions";

interface UserRevokeSessionsDialogProps {
	user: ManagedUser;
	actions: UseUserActionsReturn;
}

export function UserRevokeSessionsDialog({ user, actions }: UserRevokeSessionsDialogProps) {
	return (
		<AlertDialog open={actions.revokeDialogOpen} onOpenChange={actions.setRevokeDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={ShieldBanIcon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Revoke user sessions?</AlertDialogTitle>
					<AlertDialogDescription>
						This will sign out {user.email} from {user.activeSessionCount} active session
						{user.activeSessionCount === 1 ? "" : "s"}.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={actions.handleRevokeSessions}
						disabled={actions.revokeUserSessionsMutation.isPending}
					>
						{actions.revokeUserSessionsMutation.isPending ? "Revoking" : "Revoke sessions"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
