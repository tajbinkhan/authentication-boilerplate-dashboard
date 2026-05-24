"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { useUserList } from "@/features/users/hooks/use-user-list";

import { createUserColumns } from "./users-data-columns";
import { UsersDataTableToolbar } from "./users-data-table-toolbar";

export function UsersTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useUserList();
	const columns = useMemo(
		() =>
			createUserColumns({
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
			DataTableToolbar={UsersDataTableToolbar}
			emptyTitle="No users found"
			emptyDescription="User accounts matching your filters will appear here."
		/>
	);
}
