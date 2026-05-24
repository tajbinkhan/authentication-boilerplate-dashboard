import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import {
	useDeleteUserMutation,
	useResetUserTwoFactorMutation,
	useRevokeUserSessionsMutation,
	useUpdateUserMutation,
	useUpdateUserRoleMutation
} from "@/features/users/actions/users.mutations";
import {
	CreateUserFormValues,
	editUserFormSchema
} from "@/features/users/schemas/user-form.schema";
import type { ManagedUser, UserRole } from "@/features/users/types/users.types";
import {
	canManageUser,
	formatRevokedUserSessionsCount,
	getAssignableRoles
} from "@/features/users/utils/user-format";
import useAuth from "@/hooks/use-auth";
import { handleRequestError } from "@/lib/api/handle-request-error";

export type UseUserActionsReturn = ReturnType<typeof useUserActions>;

export function useUserActions(user: ManagedUser) {
	const router = useRouter();
	const { user: currentUser } = useAuth();
	const updateUserMutation = useUpdateUserMutation();
	const updateUserRoleMutation = useUpdateUserRoleMutation();
	const deleteUserMutation = useDeleteUserMutation();
	const revokeUserSessionsMutation = useRevokeUserSessionsMutation();
	const resetUserTwoFactorMutation = useResetUserTwoFactorMutation();

	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
	const [roleDialogOpen, setRoleDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
	const [resetTwoFactorDialogOpen, setResetTwoFactorDialogOpen] = useState(false);
	const [nextRole, setNextRole] = useState<UserRole>(user.role);

	const manageable = canManageUser(currentUser, user);
	const assignableRoles = useMemo(() => getAssignableRoles(currentUser), [currentUser]);
	const canSubmitRole = manageable && nextRole !== user.role && !updateUserRoleMutation.isPending;

	const editForm = useForm<CreateUserFormValues>({
		resolver: zodResolver(editUserFormSchema),
		defaultValues: createEditValues(user)
	});

	const handleUpdateUser = useCallback(
		(values: CreateUserFormValues) => {
			updateUserMutation.mutate(
				{
					id: user.id,
					name: emptyToNull(values.name),
					email: values.email.trim().toLowerCase(),
					phone: emptyToNull(values.phone),
					emailVerified: values.emailVerified,
					isApproved: values.isApproved
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
		},
		[updateUserMutation, router, user.id]
	);

	const handleToggleApproval = useCallback(
		(approved: boolean) => {
			updateUserMutation.mutate(
				{ id: user.id, isApproved: approved },
				{
					onSuccess: () => {
						toast.success(approved ? "User approved" : "User approval revoked");
					},
					onError: error => {
						handleRequestError(
							error,
							router,
							approved ? "Failed to approve user" : "Failed to revoke approval"
						);
					}
				}
			);
		},
		[updateUserMutation, router, user.id]
	);

	const handleUpdateRole = useCallback(() => {
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
	}, [updateUserRoleMutation, router, user.id, nextRole]);

	const handleRevokeSessions = useCallback(() => {
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
	}, [revokeUserSessionsMutation, router, user.id]);

	const handleDeleteUser = useCallback(() => {
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
	}, [deleteUserMutation, router, user.id]);

	const handleResetTwoFactor = useCallback(() => {
		resetUserTwoFactorMutation.mutate(
			{ id: user.id },
			{
				onSuccess: result => {
					toast.success(
						`Two-factor reset. ${formatRevokedUserSessionsCount(result.revokedCount)}.`
					);
					setResetTwoFactorDialogOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to reset two-factor authentication");
				}
			}
		);
	}, [resetUserTwoFactorMutation, router, user.id]);

	const resetEditForm = useCallback(() => {
		editForm.reset(createEditValues(user));
	}, [editForm, user]);

	return {
		editForm,
		updateUserMutation,
		updateUserRoleMutation,
		revokeUserSessionsMutation,
		resetUserTwoFactorMutation,
		deleteUserMutation,
		manageable,
		assignableRoles,
		canSubmitRole,
		nextRole,
		setNextRole,
		editDialogOpen,
		setEditDialogOpen,
		detailsDialogOpen,
		setDetailsDialogOpen,
		roleDialogOpen,
		setRoleDialogOpen,
		deleteDialogOpen,
		setDeleteDialogOpen,
		revokeDialogOpen,
		setRevokeDialogOpen,
		resetTwoFactorDialogOpen,
		setResetTwoFactorDialogOpen,
		handleUpdateUser,
		handleToggleApproval,
		handleUpdateRole,
		handleRevokeSessions,
		handleDeleteUser,
		handleResetTwoFactor,
		resetEditForm
	};
}

function createEditValues(user: ManagedUser): CreateUserFormValues {
	return {
		name: user.name ?? "",
		email: user.email,
		password: "",
		phone: user.phone ?? "",
		role: user.role,
		emailVerified: user.emailVerified,
		isApproved: user.isApproved
	};
}

function emptyToNull(value: string): string | null {
	const trimmed = value.trim();
	return trimmed || null;
}
