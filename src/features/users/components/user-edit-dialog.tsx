"use client";

import { FormProvider } from "react-hook-form";

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
import { UserFormFields } from "@/features/users/components/user-form-fields";
import type { ManagedUser } from "@/features/users/types/users.types";
import type { UseUserActionsReturn } from "@/features/users/hooks/use-user-actions";

interface UserEditDialogProps {
	user: ManagedUser;
	actions: UseUserActionsReturn;
}

export function UserEditDialog({ user, actions }: UserEditDialogProps) {
	return (
		<Dialog open={actions.editDialogOpen} onOpenChange={actions.setEditDialogOpen}>
			<DialogContent className="sm:max-w-2xl">
				<FormProvider {...actions.editForm}>
					<form
						onSubmit={actions.editForm.handleSubmit(actions.handleUpdateUser)}
						className="grid gap-6"
					>
						<DialogHeader>
							<DialogTitle>Edit user</DialogTitle>
							<DialogDescription>{user.email}</DialogDescription>
						</DialogHeader>
						<UserFormFields
							idPrefix={`edit-user-${user.id}`}
							disabled={actions.updateUserMutation.isPending}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={actions.updateUserMutation.isPending}>
								{actions.updateUserMutation.isPending ? "Saving" : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
