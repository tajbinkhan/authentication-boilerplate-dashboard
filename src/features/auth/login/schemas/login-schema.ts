import { z } from "zod";

import { validateEmail, validateString } from "@/validators/common-rule";

export const loginSchema = z.object({
	email: validateEmail,
	password: validateString("Password", { min: 8, max: 255 })
});

export const magicLinkRequestSchema = z.object({
	email: validateEmail
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type MagicLinkRequestSchema = z.infer<typeof magicLinkRequestSchema>;
