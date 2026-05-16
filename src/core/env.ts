import { z } from "zod";

import { validateString } from "@/validators/common-rule";

export const envSchema = z.object({
	NEXT_PUBLIC_API_URL: validateString("NEXT_PUBLIC_API_URL"),
	NEXT_PUBLIC_FRONTEND_URL: validateString("NEXT_PUBLIC_FRONTEND_URL"),
	NEXT_PUBLIC_GOOGLE_CLIENT_ID: validateString("NEXT_PUBLIC_GOOGLE_CLIENT_ID"),
	NEST_API_URL: validateString("NEST_API_URL")
});

const Env = envSchema.safeParse(process.env);

if (!Env.success) {
	const errorMessages = Env.error.issues.map(e => e.message).join("\n");
	console.error(`Environment validation failed:\n${errorMessages}`);
	process.exit(1);
}

export type EnvType = z.infer<typeof envSchema>;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends EnvType {}
	}
}
