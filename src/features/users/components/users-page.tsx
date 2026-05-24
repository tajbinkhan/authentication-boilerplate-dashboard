"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import { UserErrorAlert } from "@/features/users/components/user-error-alert";
import { UserListProvider, useUserList } from "@/features/users/hooks/use-user-list";
import { handleRequestError } from "@/lib/api/handle-request-error";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { UsersTable } from "./users-table";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Users", isCurrent: true }
];

export function UsersPage() {
	return (
		<UserListProvider>
			<UsersPageContent />
		</UserListProvider>
	);
}

function UsersPageContent() {
	const router = useRouter();
	const { error, handleRefresh } = useUserList();

	useEffect(() => {
		if (!error) return;

		handleRequestError(error, router, "Failed to load users");
	}, [error, router]);

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={UserGroupIcon} className="text-primary size-6" />
							Users
						</h1>
						<p className="text-muted-foreground text-sm">
							Review accounts, roles, verification, and active sessions.
						</p>
					</div>
					<CreateUserDialog />
				</div>
				<Card>
					<CardHeader>
						<CardTitle>User Directory</CardTitle>
						<CardDescription>Search, filter, and manage user access.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{error ? <UserErrorAlert error={error} onRetry={handleRefresh} /> : null}
						<UsersTable />
					</CardContent>
				</Card>
			</div>
		</>
	);
}

