"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";
import { EmailLogDetails } from "@/features/email-logs/components/email-log-details";
import { useEmailLogList } from "@/features/email-logs/hooks/use-email-log-list";

import { createEmailLogColumns } from "./email-logs-data-columns";
import { EmailLogsDataTableToolbar } from "./email-logs-data-table-toolbar";

export function EmailLogsTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useEmailLogList();
	const columns = useMemo(
		() =>
			createEmailLogColumns({
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
			DataTableToolbar={EmailLogsDataTableToolbar}
			emptyTitle="No email logs found"
			emptyDescription="Email send attempts matching your filters will appear here."
			rowDetailsTitle="Email log details"
			rowDetailsDescription="Full email send context and metadata."
			renderRowDetails={row => <EmailLogDetails log={row} />}
		/>
	);
}
