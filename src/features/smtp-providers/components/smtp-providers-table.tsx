"use client";

import { useCallback, useMemo, useState } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { useSmtpProviderList } from "@/features/smtp-providers/hooks/use-smtp-provider-list";
import type { SmtpProvider } from "@/features/smtp-providers/types/smtp-provider.types";

import { createSmtpProviderColumns } from "./smtp-providers-data-columns";
import { SmtpProvidersDataTableToolbar } from "./smtp-providers-data-table-toolbar";
import { SmtpProviderFormSheet } from "./smtp-provider-form-sheet";

export function SmtpProvidersTable() {
	const {
		tableData,
		pagination,
		isLoading,
		handleOptionFilter,
		sort,
		dir,
		handleSorting
	} = useSmtpProviderList();
	const [editingProvider, setEditingProvider] = useState<SmtpProvider | null>(null);

	const handleEdit = useCallback((provider: SmtpProvider) => {
		setEditingProvider(provider);
	}, []);

	const columns = useMemo(
		() =>
			createSmtpProviderColumns({
				sort: sort as string,
				dir: dir,
				handleSorting: handleSorting,
				onEdit: handleEdit
			}),
		[sort, dir, handleSorting, handleEdit]
	);

	return (
		<>
			<DataTable
				columns={columns}
				isLoading={isLoading}
				data={tableData}
				pagination={pagination}
				handleOptionFilter={handleOptionFilter}
				DataTableToolbar={SmtpProvidersDataTableToolbar}
				emptyTitle="No SMTP providers found"
				emptyDescription="Add your first email provider to start sending application emails."
			/>

			{editingProvider && (
				<SmtpProviderFormSheet
					open={!!editingProvider}
					onOpenChange={open => {
						if (!open) setEditingProvider(null);
					}}
					provider={editingProvider}
				/>
			)}
		</>
	);
}
