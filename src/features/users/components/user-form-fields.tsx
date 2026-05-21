"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CreateUserFormValues } from "@/features/users/schemas/user-form.schema";
import type { UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";

interface UserFormFieldsProps {
	idPrefix: string;
	roleOptions?: UserRole[];
	showPassword?: boolean;
	showRole?: boolean;
	disabled?: boolean;
}

export function UserFormFields({
	idPrefix,
	roleOptions = [],
	showPassword = false,
	showRole = false,
	disabled = false
}: UserFormFieldsProps) {
	const {
		register,
		control,
		formState: { errors }
	} = useFormContext<CreateUserFormValues>();

	return (
		<FieldGroup className="gap-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
					<Input
						id={`${idPrefix}-name`}
						{...register("name")}
						placeholder="Full name"
						disabled={disabled}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
					<Input
						id={`${idPrefix}-email`}
						type="email"
						{...register("email")}
						placeholder="you@example.com"
						disabled={disabled}
					/>
				</Field>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-phone`}>Phone</FieldLabel>
					<Input
						id={`${idPrefix}-phone`}
						type="tel"
						{...register("phone")}
						placeholder="+14155552671"
						disabled={disabled}
					/>
				</Field>
				{showRole ? (
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-role`}>Role</FieldLabel>
						<Controller
							name="role"
							control={control}
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={value => field.onChange(value as UserRole)}
									disabled={disabled || roleOptions.length === 0}
								>
									<SelectTrigger id={`${idPrefix}-role`} className="w-full">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent>
										{roleOptions.map(role => (
											<SelectItem key={role} value={role}>
												{formatUserRole(role)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</Field>
				) : null}
				{showPassword ? (
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-password`}>Password</FieldLabel>
						<Input
							id={`${idPrefix}-password`}
							type="password"
							{...register("password")}
							placeholder="Optional"
							disabled={disabled}
						/>
					</Field>
				) : null}
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field
					orientation="horizontal"
					className="items-center justify-between rounded-2xl border p-3"
				>
					<div>
						<FieldLabel htmlFor={`${idPrefix}-email-verified`}>Email verified</FieldLabel>
						<FieldDescription>Mark this account as verified.</FieldDescription>
					</div>
					<Controller
						name="emailVerified"
						control={control}
						render={({ field }) => (
							<Switch
								id={`${idPrefix}-email-verified`}
								checked={field.value ?? false}
								onCheckedChange={field.onChange}
								disabled={disabled}
							/>
						)}
					/>
				</Field>

				<Field
					orientation="horizontal"
					className="items-center justify-between rounded-2xl border p-3"
				>
					<div>
						<FieldLabel htmlFor={`${idPrefix}-is-approved`}>Approved</FieldLabel>
						<FieldDescription>Allow this user to sign in.</FieldDescription>
					</div>
					<Controller
						name="isApproved"
						control={control}
						render={({ field }) => (
							<Switch
								id={`${idPrefix}-is-approved`}
								checked={field.value ?? false}
								onCheckedChange={field.onChange}
								disabled={disabled}
							/>
						)}
					/>
				</Field>
			</div>
		</FieldGroup>
	);
}
