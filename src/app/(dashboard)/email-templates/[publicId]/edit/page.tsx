import { EmailTemplateEditPage } from "@/features/email-templates/components/email-template-edit-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Edit Email Template",
	description: "Edit an email template."
};

interface PageProps {
	params: Promise<{ publicId: string }>;
}

export default function Page({ params }: PageProps) {
	return <EmailTemplateEditPage params={params} />;
}
