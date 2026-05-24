"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
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

interface UserDeleteDialogProps {
	user: ManagedUser;
	actions: UseUserActionsReturn;
}

export function UserDeleteDialog({ user, actions }: UserDeleteDialogProps) {
	return (
		<AlertDialog open={actions.deleteDialogOpen} onOpenChange={actions.setDeleteDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={Delete02Icon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Delete user?</AlertDialogTitle>
					<AlertDialogDescription>
						This permanently deletes {user.email}, including linked sessions and login accounts.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={actions.handleDeleteUser}
						disabled={actions.deleteUserMutation.isPending}
					>
						{actions.deleteUserMutation.isPending ? "Deleting" : "Delete user"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
