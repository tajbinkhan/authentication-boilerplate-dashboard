"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import {
	SessionListProvider,
	useSessionList
} from "@/features/sessions/hooks/use-session-list";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionErrorAlert } from "@/features/sessions/components/session-error-alert";
import { SessionsTable } from "./sessions-table";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Sessions", isCurrent: true }
];

export function SessionsPage() {
	return (
		<SessionListProvider>
			<SessionsPageContent />
		</SessionListProvider>
	);
}

function SessionsPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useSessionList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load sessions");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-normal">Sessions</h1>
						<p className="text-muted-foreground text-sm">
							Review devices, IP addresses, and account access history.
						</p>
					</div>
					{/* <Button type="button" variant="outline" asChild>
						<Link href={route.private.sessionWorkCalendar}>Work calendar</Link>
					</Button> */}
				</div>
				<Card>
					<CardHeader>
						<CardTitle>Session History</CardTitle>
						<CardDescription>Search, filter, and revoke account sessions.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <SessionErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<SessionsTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}
