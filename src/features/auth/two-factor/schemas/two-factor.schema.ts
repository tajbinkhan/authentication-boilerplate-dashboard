import { z } from "zod";

import { validateString } from "@/validators/common-rule";

export const twoFactorCodeFormSchema = z.object({
	code: validateString("Code", { min: 6, max: 32 })
});

export type TwoFactorCodeFormValues = z.infer<typeof twoFactorCodeFormSchema>;
