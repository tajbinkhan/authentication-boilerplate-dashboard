import { EmailTemplatesPage } from "@/features/email-templates/components/email-templates-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Email Templates",
	description: "Manage your email templates."
};

export default function Page() {
	return <EmailTemplatesPage />;
}
