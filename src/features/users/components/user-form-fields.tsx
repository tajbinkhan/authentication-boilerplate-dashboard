"use client";

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
import type { UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";

export interface UserFormValues {
	name: string;
	email: string;
	password: string;
	phone: string;
	role: UserRole;
	emailVerified: boolean;
}

interface UserFormFieldsProps {
	values: UserFormValues;
	onChange: <TKey extends keyof UserFormValues>(key: TKey, value: UserFormValues[TKey]) => void;
	idPrefix: string;
	roleOptions?: UserRole[];
	showPassword?: boolean;
	showRole?: boolean;
	disabled?: boolean;
}

export function UserFormFields({
	values,
	onChange,
	idPrefix,
	roleOptions = [],
	showPassword = false,
	showRole = false,
	disabled = false
}: UserFormFieldsProps) {
	return (
		<FieldGroup className="gap-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-name`}>Name</FieldLabel>
					<Input
						id={`${idPrefix}-name`}
						value={values.name}
						onChange={event => onChange("name", event.target.value)}
						placeholder="Full name"
						disabled={disabled}
					/>
				</Field>
				<Field>
					<FieldLabel htmlFor={`${idPrefix}-email`}>Email</FieldLabel>
					<Input
						id={`${idPrefix}-email`}
						type="email"
						value={values.email}
						onChange={event => onChange("email", event.target.value)}
						placeholder="name@example.com"
						required
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
						value={values.phone}
						onChange={event => onChange("phone", event.target.value)}
						placeholder="+14155552671"
						disabled={disabled}
					/>
				</Field>
				{showRole ? (
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-role`}>Role</FieldLabel>
						<Select
							value={values.role}
							onValueChange={value => onChange("role", value as UserRole)}
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
					</Field>
				) : null}
				{showPassword ? (
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-password`}>Password</FieldLabel>
						<Input
							id={`${idPrefix}-password`}
							type="password"
							value={values.password}
							onChange={event => onChange("password", event.target.value)}
							placeholder="Optional"
							disabled={disabled}
						/>
					</Field>
				) : null}
			</div>
			<div className="grid gap-4">
				<Field orientation="horizontal" className="items-center justify-between rounded-2xl border p-3">
					<div>
						<FieldLabel htmlFor={`${idPrefix}-email-verified`}>Email verified</FieldLabel>
						<FieldDescription>Mark this account as verified.</FieldDescription>
					</div>
					<Switch
						id={`${idPrefix}-email-verified`}
						checked={values.emailVerified}
						onCheckedChange={checked => onChange("emailVerified", checked)}
						disabled={disabled}
					/>
				</Field>
			</div>
		</FieldGroup>
	);
}
