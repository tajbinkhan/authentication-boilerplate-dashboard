"use client";

import {
	ComputerRemoveIcon,
	Delete02Icon,
	MoreVerticalIcon,
	ShieldBanIcon,
	UserEdit01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import {
	useDeleteUserMutation,
	useRevokeUserSessionsMutation,
	useUpdateUserMutation,
	useUpdateUserRoleMutation
} from "@/features/users/actions/users.mutations";
import {
	type UserFormValues,
	UserFormFields
} from "@/features/users/components/user-form-fields";
import type { ManagedUser, UserRole } from "@/features/users/types/users.types";
import {
	canManageUser,
	formatRevokedUserSessionsCount,
	formatUserRole,
	getAssignableRoles
} from "@/features/users/utils/user-format";
import useAuth from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import { route } from "@/routes/routes";

interface UserDataTableRowActionsProps {
	user: ManagedUser;
}

export function UserDataTableRowActions({ user }: UserDataTableRowActionsProps) {
	const router = useRouter();
	const { user: currentUser } = useAuth();
	const updateUserMutation = useUpdateUserMutation();
	const updateUserRoleMutation = useUpdateUserRoleMutation();
	const deleteUserMutation = useDeleteUserMutation();
	const revokeUserSessionsMutation = useRevokeUserSessionsMutation();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
	const [editValues, setEditValues] = useState<UserFormValues>(() => createEditValues(user));
	const [nextRole, setNextRole] = useState<UserRole>(user.role);

	const manageable = canManageUser(currentUser, user);
	const assignableRoles = useMemo(() => getAssignableRoles(currentUser), [currentUser]);
	const canSubmitEdit =
		manageable && Boolean(editValues.email.trim()) && !updateUserMutation.isPending;
	const canSubmitRole = manageable && nextRole !== user.role && !updateUserRoleMutation.isPending;

	const handleEditValueChange = <TKey extends keyof UserFormValues>(
		key: TKey,
		value: UserFormValues[TKey]
	) => {
		setEditValues(currentValues => ({ ...currentValues, [key]: value }));
	};

	const handleUpdateUser = () => {
		updateUserMutation.mutate(
			{
				id: user.id,
				name: emptyToNull(editValues.name),
				email: editValues.email.trim().toLowerCase(),
				phone: emptyToNull(editValues.phone),
				emailVerified: editValues.emailVerified,
				is2faEnabled: editValues.is2faEnabled
			},
			{
				onSuccess: () => {
					toast.success("User updated");
					setEditDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to update user");
				}
			}
		);
	};

	const handleUpdateRole = () => {
		updateUserRoleMutation.mutate(
			{ id: user.id, role: nextRole },
			{
				onSuccess: () => {
					toast.success("User role updated");
					setRoleDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to update user role");
				}
			}
		);
	};

	const handleRevokeSessions = () => {
		revokeUserSessionsMutation.mutate(
			{ id: user.id },
			{
				onSuccess: result => {
					toast.success(formatRevokedUserSessionsCount(result.revokedCount));
					setRevokeDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to revoke user sessions");
				}
			}
		);
	};

	const handleDeleteUser = () => {
		deleteUserMutation.mutate(
			{ id: user.id },
			{
				onSuccess: () => {
					toast.success("User deleted");
					setDeleteDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to delete user");
				}
			}
		);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button type="button" variant="ghost" size="icon" aria-label={`Open actions for ${user.email}`}>
						<HugeiconsIcon icon={MoreVerticalIcon} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						disabled={!manageable}
						onSelect={event => {
							event.preventDefault();
							setEditValues(createEditValues(user));
							setEditDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Edit user
					</DropdownMenuItem>
					<DropdownMenuItem
						disabled={!manageable}
						onSelect={event => {
							event.preventDefault();
							setNextRole(user.role);
							setRoleDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Change role
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant="destructive"
						disabled={!manageable || user.activeSessionCount === 0}
						onSelect={event => {
							event.preventDefault();
							setRevokeDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={ComputerRemoveIcon} />
						Revoke sessions
					</DropdownMenuItem>
					<DropdownMenuItem
						variant="destructive"
						disabled={!manageable}
						onSelect={event => {
							event.preventDefault();
							setDeleteDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={Delete02Icon} />
						Delete user
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
				<DialogContent className="sm:max-w-2xl">
					<form
						onSubmit={event => {
							event.preventDefault();
							handleUpdateUser();
						}}
						className="grid gap-6"
					>
						<DialogHeader>
							<DialogTitle>Edit user</DialogTitle>
							<DialogDescription>{user.email}</DialogDescription>
						</DialogHeader>
						<UserFormFields
							values={editValues}
							onChange={handleEditValueChange}
							idPrefix={`edit-user-${user.id}`}
							disabled={updateUserMutation.isPending}
						/>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit" disabled={!canSubmitEdit}>
								{updateUserMutation.isPending ? "Saving" : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change user role</DialogTitle>
						<DialogDescription>{user.email}</DialogDescription>
					</DialogHeader>
					<Field>
						<FieldLabel htmlFor={`user-role-${user.id}`}>Role</FieldLabel>
						<Select value={nextRole} onValueChange={value => setNextRole(value as UserRole)}>
							<SelectTrigger id={`user-role-${user.id}`} className="w-full">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								{assignableRoles.map(role => (
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
							onClick={handleUpdateRole}
							disabled={!canSubmitRole}
						>
							{updateUserRoleMutation.isPending ? "Saving" : "Save role"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
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
							onClick={handleRevokeSessions}
							disabled={revokeUserSessionsMutation.isPending}
						>
							{revokeUserSessionsMutation.isPending ? "Revoking" : "Revoke sessions"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
							onClick={handleDeleteUser}
							disabled={deleteUserMutation.isPending}
						>
							{deleteUserMutation.isPending ? "Deleting" : "Delete user"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

function createEditValues(user: ManagedUser): UserFormValues {
	return {
		name: user.name ?? "",
		email: user.email,
		password: "",
		phone: user.phone ?? "",
		role: user.role,
		emailVerified: user.emailVerified,
		is2faEnabled: user.is2faEnabled
	};
}

function emptyToNull(value: string): string | null {
	const trimmed = value.trim();
	return trimmed || null;
}

function handleRequestError(
	error: unknown,
	router: ReturnType<typeof useRouter>,
	fallback: string
) {
	if (error instanceof ApiError && error.statusCode === 401) {
		toast.error("Please sign in again");
		router.replace(route.protected.login);
		return;
	}

	toast.error(error instanceof ApiError ? error.message : fallback);
}
