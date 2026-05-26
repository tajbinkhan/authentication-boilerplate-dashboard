import { z } from "zod";

import { validateString } from "@/validators/common-rule";

export const emailTemplateFormSchema = z.object({
	subject: validateString("Subject"),
	html: validateString("HTML"),
	text: validateString("Text").optional().or(z.literal("")),
	isActive: z.boolean().default(true)
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateFormSchema>;
