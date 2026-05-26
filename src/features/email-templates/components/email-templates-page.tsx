"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailTemplateErrorAlert } from "@/features/email-templates/components/email-template-error-alert";
import { EmailTemplatesTable } from "@/features/email-templates/components/email-templates-table";
import {
	EmailTemplateListProvider,
	useEmailTemplateList
} from "@/features/email-templates/hooks/use-email-template-list";
import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import { MailSettingIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Email Templates", isCurrent: true }
];

export function EmailTemplatesPage() {
	return (
		<EmailTemplateListProvider>
			<EmailTemplatesPageContent />
		</EmailTemplateListProvider>
	);
}

function EmailTemplatesPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useEmailTemplateList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load email templates");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={MailSettingIcon} className="text-primary size-6" />
							Email Templates
						</h1>
						<p className="text-muted-foreground text-sm">
							Manage email template content. Updates create new versions and invalidate the cache
							automatically.
						</p>
					</div>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Templates</CardTitle>
						<CardDescription>
							View and edit email template subject, HTML, and text content.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <EmailTemplateErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<EmailTemplatesTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
