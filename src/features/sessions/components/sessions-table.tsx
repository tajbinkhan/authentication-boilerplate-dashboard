"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import type { Table as TableInstance } from "@tanstack/react-table";

import { useRevokeOtherSessionsMutation } from "@/features/sessions/actions/sessions.mutations";
import { useSessionList } from "@/features/sessions/hooks/use-session-list";
import type { Session } from "@/features/sessions/types/sessions.types";
import { formatRevokedCount } from "@/features/sessions/utils/session-format";
import { ApiError } from "@/lib/api/errors";
import { route } from "@/routes/routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createSessionColumns } from "./sessions-data-columns";
import { SessionsDataTableToolbar } from "./sessions-data-table-toolbar";

export function SessionsTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useSessionList();
	const columns = useMemo(
		() =>
			createSessionColumns({
				sort: sort as string,
				dir: dir,
				handleSorting: handleSorting
			}),
		[sort, dir, handleSorting]
	);

	return (
		<DataTable
			columns={columns}
			isLoading={isLoading}
			data={tableData}
			pagination={pagination}
			handleOptionFilter={handleOptionFilter}
			DataTableToolbar={SessionsToolbar}
			emptyTitle="No sessions found"
			emptyDescription="Your active and past login sessions will appear here."
		/>
	);
}

function SessionsToolbar({ table }: { table: TableInstance<Session> }) {
	const router = useRouter();
	const { activeOtherSessionCount, handleRefresh, isFetching } = useSessionList();
	const revokeOtherSessionsMutation = useRevokeOtherSessionsMutation();

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
		<SessionsDataTableToolbar
			table={table}
			activeOtherSessionCount={activeOtherSessionCount ?? 0}
			isRefreshing={isFetching}
			isRevokeOtherSessionsPending={revokeOtherSessionsMutation.isPending}
			onRefresh={handleRefresh}
			onRevokeOtherSessions={handleRevokeOtherSessions}
		/>
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
