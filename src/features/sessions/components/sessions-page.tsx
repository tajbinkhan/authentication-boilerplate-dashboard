"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import {
	useRevokeOtherSessionsMutation,
	useRevokeSessionMutation
} from "@/features/sessions/actions/sessions.mutations";
import {
	SessionListProvider,
	useSessionList
} from "@/features/sessions/context/session-list-context";
import type { Session } from "@/features/sessions/types/sessions.types";
import { formatRevokedCount } from "@/features/sessions/utils/session-format";

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
	const revokeSessionMutation = useRevokeSessionMutation();
	const revokeOtherSessionsMutation = useRevokeOtherSessionsMutation();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load sessions");
	}, [error, router]);

	const handleRevokeSession = (session: Session) => {
		revokeSessionMutation.mutate(session.id, {
			onSuccess: revokedSession => {
				if (revokedSession.isCurrent) {
					toast.success("Session revoked. Please sign in again.");
					router.replace(route.protected.login);
					return;
				}

				toast.success("Session revoked successfully");
			},
			onError: error => {
				handleRequestError(error, router, "Failed to revoke session");
			}
		});
	};

	const handleRevokeOtherSessions = () => {
		revokeOtherSessionsMutation.mutate(undefined, {
			onSuccess: result => {
				toast.success(formatRevokedCount(result.revokedCount));
			},
			onError: error => {
				handleRequestError(error, router, "Failed to revoke other sessions");
			}
		});
	};

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

function handleRequestError(
	error: unknown,
	router: ReturnType<typeof useRouter>,
	fallback: string
) {
	if (error instanceof ApiError && error.statusCode === 401) {
		toast.error("Please sign in again");
		router.replace(route.protected.login);
		return;
	}

	toast.error(error instanceof ApiError ? error.message : fallback);
}
