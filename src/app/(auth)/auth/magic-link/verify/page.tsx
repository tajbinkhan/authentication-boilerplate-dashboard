import type { Metadata } from "next";

import { MagicLinkVerifyClient } from "@/features/auth/magic-link/verify/magic-link-verify-client";

export const metadata: Metadata = {
	title: "Verify magic link",
	description: "Verify your magic link and finish signing in."
};

interface MagicLinkVerifyPageProps {
	searchParams: Promise<{
		email?: string | string[];
		token?: string | string[];
		redirect?: string | string[];
	}>;
}

function readQueryValue(value: string | string[] | undefined): string | null {
	if (Array.isArray(value)) return value[0] ?? null;
	return value ?? null;
}

export default async function MagicLinkVerifyPage({ searchParams }: MagicLinkVerifyPageProps) {
	const params = await searchParams;

	return (
		<MagicLinkVerifyClient
			email={readQueryValue(params.email)}
			token={readQueryValue(params.token)}
			redirectUrl={readQueryValue(params.redirect)}
		/>
	);
}
