import { z } from "zod";

import { validatePassword, validateString } from "@/validators/common-rule";

export const setPasswordSchema = z.object({
	password: validatePassword,
	confirmPassword: validatePassword
}).refine(data => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});

export const changePasswordSchema = z.object({
	currentPassword: validateString("Current password", { min: 1 }),
	newPassword: validatePassword,
	confirmNewPassword: validatePassword
}).refine(data => data.newPassword === data.confirmNewPassword, {
	message: "Passwords do not match",
	path: ["confirmNewPassword"]
});

export type SetPasswordSchema = z.infer<typeof setPasswordSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
