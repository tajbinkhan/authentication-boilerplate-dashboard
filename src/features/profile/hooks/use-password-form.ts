import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePassword, setPassword } from "@/features/profile/actions/password.actions";
import {
	changePasswordSchema,
	setPasswordSchema,
	type ChangePasswordSchema,
	type SetPasswordSchema
} from "@/features/profile/schemas/password.schema";
import useAuth from "@/hooks/use-auth";

export type UsePasswordFormReturn = ReturnType<typeof usePasswordForm>;

export function usePasswordForm() {
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

	const cancelMode = () => {
		setMode(null);
		setForm.reset();
		changeForm.reset();
	};

	return {
		user,
		hasPassword,
		mode,
		setMode,
		message,
		error,
		isLoading,
		setForm,
		changeForm,
		handleSetPassword,
		handleChangePassword,
		cancelMode
	};
}
