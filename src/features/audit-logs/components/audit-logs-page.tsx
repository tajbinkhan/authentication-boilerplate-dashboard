"use client";

import { Audit01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLogErrorAlert } from "@/features/audit-logs/components/audit-log-error-alert";
import {
	AuditLogListProvider,
	useAuditLogList
} from "@/features/audit-logs/hooks/use-audit-log-list";
import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import { AuditLogsTable } from "./audit-logs-table";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Audit Logs", isCurrent: true }
];

export function AuditLogsPage() {
	return (
		<AuditLogListProvider>
			<AuditLogsPageContent />
		</AuditLogListProvider>
	);
}

function AuditLogsPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useAuditLogList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load audit logs");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={Audit01Icon} className="text-primary size-6" />
							Audit Logs
						</h1>
						<p className="text-muted-foreground text-sm">
							Review sensitive account, login, and security events.
						</p>
					</div>
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Security Event Log</CardTitle>
						<CardDescription>Filter, sort, and inspect recorded audit activity.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <AuditLogErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<AuditLogsTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

