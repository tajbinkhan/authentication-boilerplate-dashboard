import { z } from "zod";

import { userRoleValues } from "@/features/users/types/users.types";
import {
	validateBoolean,
	validateEmail,
	validateEnum,
	validateOptionalPhoneNumber,
	validateOptionalString
} from "@/validators/common-rule";

const baseUserFormSchema = z.object({
	name: validateOptionalString("Name", { max: 255 }),
	email: validateEmail,
	phone: validateOptionalPhoneNumber("Phone"),
	role: validateEnum("Role", userRoleValues),
	emailVerified: validateBoolean("Email Verified"),
	isApproved: validateBoolean("Approved").optional()
});

export const createUserFormSchema = baseUserFormSchema.extend({
	password: validateOptionalString("Password", { max: 255 })
});

export const editUserFormSchema = baseUserFormSchema.extend({
	password: validateOptionalString("Password", { max: 255 })
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type EditUserFormValues = z.infer<typeof editUserFormSchema>;
