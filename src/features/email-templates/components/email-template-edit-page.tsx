"use client";

import { ArrowLeft01Icon, MailSettingIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

import { handleRequestError } from "@/lib/api/handle-request-error";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { useEmailTemplateQuery } from "@/features/email-templates/actions/email-template.queries";
import { EmailTemplateForm } from "@/features/email-templates/components/email-template-form";
import type { EmailTemplate } from "@/features/email-templates/types/email-template.types";
import { formatEmailTemplateDate } from "@/features/email-templates/utils/email-template-format";
import { type BreadcrumbItem, SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

interface EmailTemplateEditPageProps {
	publicId: string;
}

const EDIT_TEMPLATE_FALLBACK_LABEL = "Edit Template";

export function EmailTemplateEditPage({ publicId }: EmailTemplateEditPageProps) {
	const router = useRouter();
	const templateQuery = useEmailTemplateQuery(publicId);

	const template = templateQuery.data;
	const breadcrumbItems = useMemo(
		() => getBreadcrumbItems(template?.key ?? EDIT_TEMPLATE_FALLBACK_LABEL),
		[template?.key]
	);

	useEffect(() => {
		if (templateQuery.error) {
			handleRequestError(templateQuery.error, router, "Failed to load email template");
		}
	}, [templateQuery.error, router]);

	const navigateToTemplates = useCallback(() => {
		router.push(route.private.emailTemplates);
	}, [router]);

	const handleSuccess = useCallback(() => {
		toast.success("Template updated");
		navigateToTemplates();
	}, [navigateToTemplates]);

	if (templateQuery.isLoading) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<LoadingSkeleton />
			</>
		);
	}

	if (!template) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<TemplateNotFound onBack={navigateToTemplates} />
			</>
		);
	}

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<EditTemplateHeader onBack={navigateToTemplates} />
				<Card className="gap-0">
					<CardHeader className="border-b pb-5">
						<TemplateCardHeader template={template} />
					</CardHeader>
					<CardContent className="pt-6">
						<EmailTemplateForm
							template={template}
							onSuccess={handleSuccess}
							onCancel={navigateToTemplates}
						/>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

function getBreadcrumbItems(currentPageName: string): BreadcrumbItem[] {
	return [
		{ name: "Dashboard", href: route.private.dashboard },
		{ name: "Email Templates", href: route.private.emailTemplates },
		{ name: currentPageName, isCurrent: true }
	];
}

function LoadingSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-80" />
				</div>
				<Skeleton className="h-9 w-36" />
			</div>
			<Card className="gap-0">
				<CardHeader className="border-b pb-5">
					<div className="flex flex-col gap-2">
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-4 w-56" />
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4 pt-6">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-10 w-full" />
					<div className="flex gap-3">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

function TemplateNotFound({ onBack }: { onBack: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center gap-4 py-24">
			<p className="text-muted-foreground text-sm">Template not found.</p>
			<Button type="button" variant="outline" onClick={onBack}>
				<HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
				Back to Templates
			</Button>
		</div>
	);
}

function EditTemplateHeader({ onBack }: { onBack: () => void }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
			<div className="min-w-0">
				<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
					<HugeiconsIcon icon={MailSettingIcon} className="text-primary size-6" />
					Edit Template
				</h1>
				<p className="text-muted-foreground text-sm">
					Update the email template content. A new version will be created and the cache will be
					invalidated.
				</p>
			</div>
			<Button type="button" variant="outline" size="sm" onClick={onBack} className="self-start">
				<HugeiconsIcon icon={ArrowLeft01Icon} data-icon="inline-start" />
				Back to Templates
			</Button>
		</div>
	);
}

function TemplateCardHeader({ template }: { template: EmailTemplate }) {
	return (
		<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
			<div className="min-w-0">
				<CardTitle className="truncate font-mono text-base">{template.key}</CardTitle>
				<TemplateVersionDescription template={template} />
			</div>
			<Badge variant={template.isActive ? "default" : "outline"} className="self-start">
				{template.isActive ? "Active" : "Inactive"}
			</Badge>
		</div>
	);
}

function TemplateVersionDescription({ template }: { template: EmailTemplate }) {
	return (
		<CardDescription>
			Version {template.version} &middot; Last updated {formatEmailTemplateDate(template.updatedAt)}
		</CardDescription>
	);
}
