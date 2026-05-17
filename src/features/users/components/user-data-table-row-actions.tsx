"use client";

import {
	ComputerRemoveIcon,
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
	useRevokeUserSessionsMutation,
	useUpdateUserRoleMutation
} from "@/features/users/actions/users.mutations";
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
	const updateUserRoleMutation = useUpdateUserRoleMutation();
	const revokeUserSessionsMutation = useRevokeUserSessionsMutation();
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
	const [nextRole, setNextRole] = useState<UserRole>(user.role);

	const manageable = canManageUser(currentUser, user);
	const assignableRoles = useMemo(() => getAssignableRoles(currentUser), [currentUser]);
	const canSubmitRole = manageable && nextRole !== user.role && !updateUserRoleMutation.isPending;

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
							setNextRole(user.role);
							setRoleDialogOpen(true);
						}}
					>
						<HugeiconsIcon icon={UserEdit01Icon} />
						Change role
					</DropdownMenuItem>
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
				</DropdownMenuContent>
			</DropdownMenu>

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
		</>
	);
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
