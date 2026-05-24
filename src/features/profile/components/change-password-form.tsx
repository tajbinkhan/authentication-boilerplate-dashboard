"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { UsePasswordFormReturn } from "@/features/profile/hooks/use-password-form";

interface ChangePasswordFormProps {
	form: UsePasswordFormReturn;
}

export function ChangePasswordForm({ form }: ChangePasswordFormProps) {
	return (
		<form
			onSubmit={form.changeForm.handleSubmit(form.handleChangePassword)}
			className="space-y-4"
			noValidate
		>
			<Field>
				<FieldLabel htmlFor="current-password">Current Password</FieldLabel>
				<FieldContent>
					<Input
						id="current-password"
						type="password"
						{...form.changeForm.register("currentPassword")}
						placeholder="Enter current password"
						autoComplete="current-password"
						className="rounded-xl"
						disabled={form.isLoading}
					/>
					<FieldError>{form.changeForm.formState.errors.currentPassword?.message}</FieldError>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel htmlFor="new-password">New Password</FieldLabel>
				<FieldContent>
					<Input
						id="new-password"
						type="password"
						{...form.changeForm.register("newPassword")}
						placeholder="Enter new password"
						autoComplete="new-password"
						className="rounded-xl"
						disabled={form.isLoading}
					/>
					<FieldError>{form.changeForm.formState.errors.newPassword?.message}</FieldError>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel htmlFor="confirm-new-password">Confirm New Password</FieldLabel>
				<FieldContent>
					<Input
						id="confirm-new-password"
						type="password"
						{...form.changeForm.register("confirmNewPassword")}
						placeholder="Confirm new password"
						autoComplete="new-password"
						className="rounded-xl"
						disabled={form.isLoading}
					/>
					<FieldError>{form.changeForm.formState.errors.confirmNewPassword?.message}</FieldError>
				</FieldContent>
			</Field>

			<div className="flex gap-2">
				<Button type="submit" disabled={form.isLoading} className="flex-1 rounded-xl">
					{form.isLoading ? (
						<>
							<HugeiconsIcon icon={Loading03Icon} className="mr-2 size-4 animate-spin" />
							Changing...
						</>
					) : (
						"Change Password"
					)}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={form.cancelMode}
					disabled={form.isLoading}
					className="flex-1 rounded-xl"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
