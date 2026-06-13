import { z } from "zod";

import {
	validateBoolean,
	validateEmail,
	validateOptionalPhoneNumber,
	validateOptionalString,
	validateString
} from "@/validators/common-rule";

const baseUserFormSchema = z.object({
	name: validateOptionalString("Name", { max: 255 }),
	email: validateEmail,
	phone: validateOptionalPhoneNumber("Phone"),
	role: validateString("Role"),
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
