import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

interface DataTableDeleteSelectedProps {
	selectedIds: string[];
	isDeleting: boolean;
	handleDeleteSelected: () => void;
	showDeleteAll?: boolean;
}

export default function DataTableDeleteSelected({
	selectedIds,
	isDeleting,
	handleDeleteSelected,
	showDeleteAll = false
}: DataTableDeleteSelectedProps) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDelete = () => {
		handleDeleteSelected();
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				{selectedIds.length > 0 ? (
					<Button size="sm" className="hidden h-8 lg:flex" variant="destructive">
						<HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden="true" />
						Delete ({selectedIds.length})
					</Button>
				) : (
					showDeleteAll && (
						<Button size="sm" className="hidden h-8 lg:flex" variant="destructive">
							<HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden="true" />
							Delete All
						</Button>
					)
				)}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
					<LoadingButton
						variant="destructive"
						isLoading={isDeleting}
						onClick={handleDelete}
						loadingText="Deleting..."
					>
						{selectedIds.length > 0 ? (
							<>
								<HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden="true" />
								Delete ({selectedIds.length})
							</>
						) : (
							<>
								<HugeiconsIcon icon={Delete02Icon} className="size-4" aria-hidden="true" />
								Delete All
							</>
						)}
					</LoadingButton>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
