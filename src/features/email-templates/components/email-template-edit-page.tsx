"use client";

import { ArrowLeft01Icon, MailSettingIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailTemplateForm } from "@/features/email-templates/components/email-template-form";
import { useEmailTemplatesQuery } from "@/features/email-templates/actions/email-template.queries";
import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

interface EmailTemplateEditPageProps {
	params: Promise<{ publicId: string }>;
}

export function EmailTemplateEditPage({ params }: EmailTemplateEditPageProps) {
	const router = useRouter();
	const templatesQuery = useEmailTemplatesQuery({ page: 1, pageSize: 100, sort: "createdAt", dir: "desc" });

	const template = templatesQuery.data?.rows.find(t => t.publicId === (params as unknown as { publicId: string }).publicId);

	useEffect(() => {
		if (templatesQuery.error) {
			handleRequestError(templatesQuery.error, router, "Failed to load email templates");
		}
	}, [templatesQuery.error, router]);

	const handleSuccess = useCallback(() => {
		toast.success("Template updated");
		router.push(route.private.emailTemplates);
	}, [router]);

	const handleCancel = useCallback(() => {
		router.push(route.private.emailTemplates);
	}, [router]);

	const breadcrumbItems = [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Email Templates", href: route.private.emailTemplates },
		{ name: template ? template.key : "Edit Template", isCurrent: true }
	];

	if (templatesQuery.isLoading) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<div className="flex items-center justify-center py-24">
					<p className="text-muted-foreground text-sm">Loading template...</p>
				</div>
			</>
		);
	}

	if (!template) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<div className="flex flex-col items-center justify-center gap-4 py-24">
					<p className="text-muted-foreground text-sm">Template not found.</p>
					<Button type="button" variant="outline" onClick={() => router.push(route.private.emailTemplates)}>
						<HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
						Back to Templates
					</Button>
				</div>
			</>
		);
	}

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={MailSettingIcon} className="text-primary size-6" />
							Edit Template
						</h1>
						<p className="text-muted-foreground text-sm">
							Update the email template content. A new version will be created and the cache will
							be invalidated.
						</p>
					</div>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>{template.key}</CardTitle>
						<CardDescription>
							Version {template.version} &middot; Last updated{" "}
							{new Date(template.updatedAt).toLocaleDateString()}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<EmailTemplateForm
							template={template}
							onSuccess={handleSuccess}
							onCancel={handleCancel}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
