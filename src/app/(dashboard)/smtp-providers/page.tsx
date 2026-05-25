import { SmtpProvidersPage } from "@/features/smtp-providers/components/smtp-providers-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "SMTP Providers",
	description: "Manage your SMTP providers."
};

export default function Page() {
	return <SmtpProvidersPage />;
}

