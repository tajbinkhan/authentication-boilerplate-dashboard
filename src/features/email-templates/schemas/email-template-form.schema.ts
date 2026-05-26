import { z } from "zod";

import { validateString } from "@/validators/common-rule";

export const emailTemplateFormSchema = z.object({
	subject: validateString("Subject", { min: 1 }),
	html: validateString("HTML", { min: 1 }),
	text: validateString("Text").optional().or(z.literal("")),
	isActive: z.boolean()
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateFormSchema>;
