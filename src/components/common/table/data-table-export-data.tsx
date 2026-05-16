import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { LoadingButton } from "@/components/ui/loading-button";

interface DataTableExportDataProps {
	isExporting: boolean;
	handleExportData: () => void;
}

export default function DataTableExportData({
	isExporting,
	handleExportData
}: DataTableExportDataProps) {
	return (
		<LoadingButton
			size="sm"
			className="hidden h-8 lg:flex"
			loadingText="Exporting..."
			isLoading={isExporting}
			onClick={handleExportData}
		>
			<HugeiconsIcon icon={Download04Icon} className="size-4" aria-hidden="true" />
			Export Data
		</LoadingButton>
	);
}
