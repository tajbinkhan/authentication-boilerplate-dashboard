"use client";

import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { UsePasswordFormReturn } from "@/features/profile/hooks/use-password-form";

interface SetPasswordFormProps {
	form: UsePasswordFormReturn;
}

export function SetPasswordForm({ form }: SetPasswordFormProps) {
	return (
		<form
			onSubmit={form.setForm.handleSubmit(form.handleSetPassword)}
			className="space-y-4"
			noValidate
		>
			<Field>
				<FieldLabel htmlFor="set-password">Password</FieldLabel>
				<FieldContent>
					<Input
						id="set-password"
						type="password"
						{...form.setForm.register("password")}
						placeholder="Enter password"
						autoComplete="new-password"
						className="rounded-xl"
						disabled={form.isLoading}
					/>
					<FieldError>{form.setForm.formState.errors.password?.message}</FieldError>
				</FieldContent>
			</Field>

			<Field>
				<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
				<FieldContent>
					<Input
						id="confirm-password"
						type="password"
						{...form.setForm.register("confirmPassword")}
						placeholder="Confirm password"
						autoComplete="new-password"
						className="rounded-xl"
						disabled={form.isLoading}
					/>
					<FieldError>{form.setForm.formState.errors.confirmPassword?.message}</FieldError>
				</FieldContent>
			</Field>

			<div className="flex gap-2">
				<Button type="submit" disabled={form.isLoading} className="flex-1 rounded-xl">
					{form.isLoading ? (
						<>
							<HugeiconsIcon icon={Loading03Icon} className="mr-2 size-4 animate-spin" />
							Setting...
						</>
					) : (
						"Set Password"
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
