"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SmtpProviderErrorAlert } from "@/features/smtp-providers/components/smtp-provider-error-alert";
import { SmtpProviderFormSheet } from "@/features/smtp-providers/components/smtp-provider-form-sheet";
import { SmtpProvidersTable } from "@/features/smtp-providers/components/smtp-providers-table";
import {
	SmtpProviderListProvider,
	useSmtpProviderList
} from "@/features/smtp-providers/hooks/use-smtp-provider-list";
import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import { Mail01Icon, PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "SMTP Providers", isCurrent: true }
];

export function SmtpProvidersPage() {
	return (
		<SmtpProviderListProvider>
			<SmtpProvidersPageContent />
		</SmtpProviderListProvider>
	);
}

function SmtpProvidersPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useSmtpProviderList();
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load SMTP providers");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={Mail01Icon} className="text-primary size-6" />
							SMTP Providers
						</h1>
						<p className="text-muted-foreground text-sm">
							Configure email providers for sending application emails. The default provider is
							used first, with automatic fallback to other active providers.
						</p>
					</div>
					<Button type="button" size="sm" onClick={() => setIsCreateOpen(true)}>
						<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
						Add Provider
					</Button>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Email Providers</CardTitle>
						<CardDescription>Manage SMTP providers, test connections, and set defaults.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <SmtpProviderErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<SmtpProvidersTable />
					</CardContent>
				</Card>

				<SmtpProviderFormSheet
					open={isCreateOpen}
					onOpenChange={setIsCreateOpen}
				/>
			</div>
		</>
	);
}
