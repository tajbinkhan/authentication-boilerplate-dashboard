"use client";

import { useCallback, useMemo, useState } from "react";

import { DataTable } from "@/components/common/table/data-table";

import { useEmailTemplateList } from "@/features/email-templates/hooks/use-email-template-list";
import type { EmailTemplate } from "@/features/email-templates/types/email-template.types";

import { createEmailTemplateColumns } from "./email-templates-data-columns";
import { EmailTemplatesDataTableToolbar } from "./email-templates-data-table-toolbar";

export function EmailTemplatesTable() {
	const { tableData, pagination, isLoading, handleOptionFilter, sort, dir, handleSorting } =
		useEmailTemplateList();
	const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

	const handleEdit = useCallback((template: EmailTemplate) => {
		setEditingTemplate(template);
	}, []);

	const columns = useMemo(
		() =>
			createEmailTemplateColumns({
				sort: sort as string,
				dir: dir,
				handleSorting: handleSorting
			}),
		[sort, dir, handleSorting]
	);

	return (
		<>
			<DataTable
				columns={columns}
				isLoading={isLoading}
				data={tableData}
				pagination={pagination}
				handleOptionFilter={handleOptionFilter}
				DataTableToolbar={EmailTemplatesDataTableToolbar}
				emptyTitle="No email templates found"
				emptyDescription="Email templates are seeded during database setup. Contact an administrator if templates are missing."
			/>
		</>
	);
}
