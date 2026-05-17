import { SessionsPage } from "@/features/sessions/components/sessions-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sessions",
	description: "Sessions page of the Next.js boilerplate."
};

export default function Sessions() {
	return <SessionsPage />;
}

