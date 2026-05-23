"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircleIcon,
	Loading03Icon,
	LockSync01Icon,
	Tick02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePassword, setPassword } from "@/features/profile/actions/password.actions";
import {
	changePasswordSchema,
	setPasswordSchema,
	type ChangePasswordSchema,
	type SetPasswordSchema
} from "@/features/profile/schemas/password.schema";
import useAuth from "@/hooks/use-auth";
import { route } from "@/routes/routes";

export function PasswordCard() {
	const { user, setUser } = useAuth();
	const [mode, setMode] = useState<"set" | "change" | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const hasPassword = user?.hasPassword ?? false;

	const setForm = useForm<SetPasswordSchema>({
		resolver: zodResolver(setPasswordSchema),
		defaultValues: { password: "", confirmPassword: "" }
	});

	const changeForm = useForm<ChangePasswordSchema>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" }
	});

	const handleSetPassword = async (values: SetPasswordSchema) => {
		setIsLoading(true);
		setError(null);
		setMessage(null);

		const result = await setPassword(values.password);

		if (!result.success) {
			setError(result.message);
		} else {
			setMessage(result.message);
			setForm.reset();
			setUser({ ...user!, hasPassword: true });
			setMode(null);
		}

		setIsLoading(false);
	};

	const handleChangePassword = async (values: ChangePasswordSchema) => {
		setIsLoading(true);
		setError(null);
		setMessage(null);

		const result = await changePassword(values.currentPassword, values.newPassword);

		if (!result.success) {
			setError(result.message);
		} else {
			setMessage(result.message);
			changeForm.reset();
		}

		setIsLoading(false);
	};

	if (!user) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>Sign in to manage your password.</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (!user.is2faEnabled && !hasPassword) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Password</CardTitle>
					<CardDescription>
						Enable two-factor authentication before setting a password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Alert className="border-amber-500/20 bg-amber-500/5 text-amber-600 dark:border-amber-500/30 dark:text-amber-400">
						<HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
						<AlertTitle className="text-sm font-semibold">2FA Required</AlertTitle>
						<AlertDescription className="text-xs">
							You must enable two-factor authentication before you can set a password.{" "}
							<a href={route.private.profile} className="font-medium underline">
								Go to security settings
							</a>
						</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>
					{hasPassword ? "Change your password" : "Set a password for your account"}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{message && (
					<Alert className="border-primary/20 bg-primary/5 text-primary">
						<HugeiconsIcon icon={Tick02Icon} className="size-4" />
						<AlertTitle>Success</AlertTitle>
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				)}

				{error && (
					<Alert variant="destructive">
						<HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{!hasPassword && mode !== "set" && mode !== "change" && (
					<Button onClick={() => setMode("set")} className="rounded-xl">
						<HugeiconsIcon icon={LockSync01Icon} className="size-4" />
						Set Password
					</Button>
				)}

				{hasPassword && mode !== "set" && mode !== "change" && (
					<Button onClick={() => setMode("change")} className="rounded-xl">
						<HugeiconsIcon icon={LockSync01Icon} className="size-4" />
						Change Password
					</Button>
				)}

				{mode === "set" && (
					<form onSubmit={setForm.handleSubmit(handleSetPassword)} className="space-y-4" noValidate>
						<Field>
							<FieldLabel htmlFor="set-password">Password</FieldLabel>
							<FieldContent>
								<Input
									id="set-password"
									type="password"
									{...setForm.register("password")}
									placeholder="Enter password"
									autoComplete="new-password"
									className="rounded-xl"
									disabled={isLoading}
								/>
								<FieldError>{setForm.formState.errors.password?.message}</FieldError>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
							<FieldContent>
								<Input
									id="confirm-password"
									type="password"
									{...setForm.register("confirmPassword")}
									placeholder="Confirm password"
									autoComplete="new-password"
									className="rounded-xl"
									disabled={isLoading}
								/>
								<FieldError>{setForm.formState.errors.confirmPassword?.message}</FieldError>
							</FieldContent>
						</Field>

						<div className="flex gap-2">
							<Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
								{isLoading ? (
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
								onClick={() => {
									setMode(null);
									setForm.reset();
								}}
								disabled={isLoading}
								className="flex-1 rounded-xl"
							>
								Cancel
							</Button>
						</div>
					</form>
				)}

				{mode === "change" && (
					<form
						onSubmit={changeForm.handleSubmit(handleChangePassword)}
						className="space-y-4"
						noValidate
					>
						<Field>
							<FieldLabel htmlFor="current-password">Current Password</FieldLabel>
							<FieldContent>
								<Input
									id="current-password"
									type="password"
									{...changeForm.register("currentPassword")}
									placeholder="Enter current password"
									autoComplete="current-password"
									className="rounded-xl"
									disabled={isLoading}
								/>
								<FieldError>{changeForm.formState.errors.currentPassword?.message}</FieldError>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="new-password">New Password</FieldLabel>
							<FieldContent>
								<Input
									id="new-password"
									type="password"
									{...changeForm.register("newPassword")}
									placeholder="Enter new password"
									autoComplete="new-password"
									className="rounded-xl"
									disabled={isLoading}
								/>
								<FieldError>{changeForm.formState.errors.newPassword?.message}</FieldError>
							</FieldContent>
						</Field>

						<Field>
							<FieldLabel htmlFor="confirm-new-password">Confirm New Password</FieldLabel>
							<FieldContent>
								<Input
									id="confirm-new-password"
									type="password"
									{...changeForm.register("confirmNewPassword")}
									placeholder="Confirm new password"
									autoComplete="new-password"
									className="rounded-xl"
									disabled={isLoading}
								/>
								<FieldError>{changeForm.formState.errors.confirmNewPassword?.message}</FieldError>
							</FieldContent>
						</Field>

						<div className="flex gap-2">
							<Button type="submit" disabled={isLoading} className="flex-1 rounded-xl">
								{isLoading ? (
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
								onClick={() => {
									setMode(null);
									changeForm.reset();
								}}
								disabled={isLoading}
								className="flex-1 rounded-xl"
							>
								Cancel
							</Button>
						</div>
					</form>
				)}
			</CardContent>
		</Card>
	);
}

