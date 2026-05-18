import { z } from "zod";

import { validateOptionalPhoneNumber, validateOptionalString } from "@/validators/common-rule";

export const MAX_PROFILE_IMAGE_BYTES = 2 * 1024 * 1024;
export const PROFILE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
export const PROFILE_IMAGE_ACCEPT = ".png,.jpg,.jpeg,.webp";

export const profileUpdateSchema = z.object({
	name: validateOptionalString("Name", { max: 255 }),
	phone: validateOptionalPhoneNumber("Phone"),
	avatar: z
		.custom<File | null>(value => value === null || value instanceof File, {
			message: "Choose a valid image file"
		})
		.superRefine((file, ctx) => {
			if (!file) return;

			if (!PROFILE_IMAGE_TYPES.includes(file.type as (typeof PROFILE_IMAGE_TYPES)[number])) {
				ctx.addIssue({
					code: "custom",
					message: "Choose a PNG, JPG, or WEBP image."
				});
			}

			if (file.size > MAX_PROFILE_IMAGE_BYTES) {
				ctx.addIssue({
					code: "custom",
					message: "Choose an image smaller than 2MB."
				});
			}
		})
});

export type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;
