"use client";

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
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import type { ManagedUser, UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";
import type { UseUserActionsReturn } from "@/features/users/hooks/use-user-actions";

interface UserRoleDialogProps {
	user: ManagedUser;
	actions: UseUserActionsReturn;
}

export function UserRoleDialog({ user, actions }: UserRoleDialogProps) {
	return (
		<Dialog open={actions.roleDialogOpen} onOpenChange={actions.setRoleDialogOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Change user role</DialogTitle>
					<DialogDescription>{user.email}</DialogDescription>
				</DialogHeader>
				<Field>
					<FieldLabel htmlFor={`user-role-${user.id}`}>Role</FieldLabel>
					<Select
						value={actions.nextRole}
						onValueChange={value => actions.setNextRole(value as UserRole)}
					>
						<SelectTrigger id={`user-role-${user.id}`} className="w-full">
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							{actions.assignableRoles.map(role => (
								<SelectItem key={role} value={role}>
									{formatUserRole(role)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={actions.handleUpdateRole}
						disabled={!actions.canSubmitRole}
					>
						{actions.updateUserRoleMutation.isPending ? "Saving" : "Save role"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
