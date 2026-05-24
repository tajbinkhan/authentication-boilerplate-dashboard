import { MagicLinkSuccessClient } from "@/features/auth/magic-link/success/magic-link-success-client";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Magic Link Success",
	description: "Magic link success page of the Next.js boilerplate."
};

export default function MagicLinkSuccessPage() {
	return <MagicLinkSuccessClient />;
}
