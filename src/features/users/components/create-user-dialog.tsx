"use client";

import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

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
import { useCreateUserMutation } from "@/features/users/actions/users.mutations";
import {
	type UserFormValues,
	UserFormFields
} from "@/features/users/components/user-form-fields";
import {
	getAssignableRoles,
	getDefaultAssignableRole
} from "@/features/users/utils/user-format";
import useAuth from "@/hooks/use-auth";
import { ApiError } from "@/lib/api/errors";
import { route } from "@/routes/routes";

export function CreateUserDialog() {
	const router = useRouter();
	const { user: currentUser } = useAuth();
	const createUserMutation = useCreateUserMutation();
	const assignableRoles = useMemo(() => getAssignableRoles(currentUser), [currentUser]);
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState<UserFormValues>(() => createInitialValues(currentUser));
	const canSubmit =
		Boolean(values.email.trim()) && assignableRoles.length > 0 && !createUserMutation.isPending;

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setValues(createInitialValues(currentUser));
		}

		setOpen(nextOpen);
	};

	const handleValueChange = <TKey extends keyof UserFormValues>(
		key: TKey,
		value: UserFormValues[TKey]
	) => {
		setValues(currentValues => ({ ...currentValues, [key]: value }));
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		createUserMutation.mutate(
			{
				name: emptyToNull(values.name),
				email: values.email.trim().toLowerCase(),
				password: emptyToNull(values.password),
				phone: emptyToNull(values.phone),
				emailVerified: values.emailVerified,
				role: values.role
			},
			{
				onSuccess: () => {
					toast.success("User created");
					setOpen(false);
				},
				onError: error => {
					handleRequestError(error, router, "Failed to create user");
				}
			}
		);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<Button type="button" onClick={() => handleOpenChange(true)} disabled={assignableRoles.length === 0}>
				<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
				Create user
			</Button>
			<DialogContent className="sm:max-w-2xl">
				<form onSubmit={handleSubmit} className="grid gap-6">
					<DialogHeader>
						<DialogTitle>Create user</DialogTitle>
						<DialogDescription>Add a managed account with the allowed role hierarchy.</DialogDescription>
					</DialogHeader>
					<UserFormFields
						values={values}
						onChange={handleValueChange}
						idPrefix="create-user"
						roleOptions={assignableRoles}
						showPassword
						showRole
						disabled={createUserMutation.isPending}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={!canSubmit}>
							{createUserMutation.isPending ? "Creating" : "Create user"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function createInitialValues(currentUser: User | null | undefined): UserFormValues {
	return {
		name: "",
		email: "",
		password: "",
		phone: "",
		role: getDefaultAssignableRole(currentUser),
		emailVerified: false
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
