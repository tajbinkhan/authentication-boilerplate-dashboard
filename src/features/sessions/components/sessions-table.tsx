"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import type { Table as TableInstance } from "@tanstack/react-table";

import { useSessionList } from "@/features/sessions/context/session-list-context";
import type { Session } from "@/features/sessions/types/sessions.types";

import { createSessionColumns } from "./sessions-data-columns";
import { SessionsDataTableToolbar } from "./sessions-data-table-toolbar";

interface SessionsTableProps {
	sessions?: Session[];
	isLoading?: boolean;
	activeOtherSessionCount?: number;
	onRefresh?: () => void;
	onRevokeOtherSessions?: () => void;
	isRefreshing?: boolean;
	isRevokeOtherSessionsPending?: boolean;
}

export function SessionsTable({
	onRevokeOtherSessions,
	isRevokeOtherSessionsPending
}: SessionsTableProps) {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		handleRefresh,
		activeOtherSessionCount,
		isFetching,
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

	function SessionsToolbar({ table }: { table: TableInstance<Session> }) {
		return (
			<SessionsDataTableToolbar
				table={table}
				activeOtherSessionCount={activeOtherSessionCount ?? 0}
				isRefreshing={isFetching}
				isRevokeOtherSessionsPending={!!isRevokeOtherSessionsPending}
				onRefresh={handleRefresh}
				onRevokeOtherSessions={onRevokeOtherSessions ?? (() => undefined)}
			/>
		);
	}

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
