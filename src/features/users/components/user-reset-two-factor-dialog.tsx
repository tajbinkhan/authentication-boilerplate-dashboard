"use client";

import { LockKeyIcon } from "@hugeicons/core-free-icons";
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

interface UserResetTwoFactorDialogProps {
	user: ManagedUser;
	actions: UseUserActionsReturn;
}

export function UserResetTwoFactorDialog({ user, actions }: UserResetTwoFactorDialogProps) {
	return (
		<AlertDialog
			open={actions.resetTwoFactorDialogOpen}
			onOpenChange={actions.setResetTwoFactorDialogOpen}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={LockKeyIcon} />
					</AlertDialogMedia>
					<AlertDialogTitle>Reset user 2FA?</AlertDialogTitle>
					<AlertDialogDescription>
						This disables two-factor authentication for {user.email} and revokes all of their
						sessions.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={actions.handleResetTwoFactor}
						disabled={actions.resetUserTwoFactorMutation.isPending}
					>
						{actions.resetUserTwoFactorMutation.isPending ? "Resetting" : "Reset 2FA"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
