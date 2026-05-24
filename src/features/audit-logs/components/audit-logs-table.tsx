"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import { AuditLogDetails } from "@/features/audit-logs/components/audit-log-details";
import { useAuditLogList } from "@/features/audit-logs/hooks/use-audit-log-list";

import { createAuditLogColumns } from "./audit-logs-data-columns";
import { AuditLogsDataTableToolbar } from "./audit-logs-data-table-toolbar";

export function AuditLogsTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useAuditLogList();
	const columns = useMemo(
		() =>
			createAuditLogColumns({
				sort: sort as string,
				dir,
				handleSorting
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
			DataTableToolbar={AuditLogsDataTableToolbar}
			emptyTitle="No audit logs found"
			emptyDescription="Security events matching your filters will appear here."
			rowDetailsTitle="Audit log details"
			rowDetailsDescription="Full event context and metadata."
			renderRowDetails={row => <AuditLogDetails log={row} />}
		/>
	);
}
