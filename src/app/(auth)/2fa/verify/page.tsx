import type { Metadata } from "next";

import { TwoFactorVerifyClient } from "@/features/auth/two-factor/verify/two-factor-verify-client";

export const metadata: Metadata = {
	title: "Verify two-factor authentication",
	description: "Complete two-factor authentication to continue."
};

interface TwoFactorVerifyPageProps {
	searchParams: Promise<{
		redirect?: string | string[];
	}>;
}

function readQueryValue(value: string | string[] | undefined): string | null {
	if (Array.isArray(value)) return value[0] ?? null;
	return value ?? null;
}

export default async function TwoFactorVerifyPage({ searchParams }: TwoFactorVerifyPageProps) {
	const params = await searchParams;

	return <TwoFactorVerifyClient redirectUrl={readQueryValue(params.redirect)} />;
}
