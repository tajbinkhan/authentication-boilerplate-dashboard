import type { Metadata } from "next";

import { EmailTemplateEditPage } from "@/features/email-templates/components/email-template-edit-page";

export const metadata: Metadata = {
	title: "Edit Email Template",
	description: "Edit an email template."
};

interface PageProps {
	params: Promise<{ publicId: string }>;
}

export default async function Page({ params }: PageProps) {
	const { publicId } = await params;

	return <EmailTemplateEditPage publicId={publicId} />;
}
