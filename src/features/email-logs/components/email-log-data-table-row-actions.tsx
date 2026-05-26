"use client";

import { Delete01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	useDeleteEmailLogMutation,
	useResendEmailLogMutation
} from "@/features/email-logs/actions/email-log.mutations";
import type { EmailLog } from "@/features/email-logs/types/email-log.types";
import { getEmailLogErrorMessage } from "@/features/email-logs/utils/email-log-errors";

interface EmailLogDataTableRowActionsProps {
	log: EmailLog;
}

export function EmailLogDataTableRowActions({ log }: EmailLogDataTableRowActionsProps) {
	const resendMutation = useResendEmailLogMutation();
	const deleteMutation = useDeleteEmailLogMutation();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleResend = () => {
		void toast.promise(resendMutation.mutateAsync(log.id), {
			loading: "Resending email...",
			success: "Email resent successfully",
			error: error => getEmailLogErrorMessage(error)
		});
	};

	const handleDelete = () => {
		void toast.promise(deleteMutation.mutateAsync(log.id), {
			loading: "Deleting log...",
			success: "Email log deleted",
			error: error => getEmailLogErrorMessage(error)
		});
		setDeleteDialogOpen(false);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="flex size-8 p-0 data-[state=open]:bg-muted"
						data-no-row-click
					>
						<span className="sr-only">Open menu</span>
						<HugeiconsIcon icon={Delete01Icon} className="size-4 rotate-180" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-40">
					<DropdownMenuItem
						onClick={handleResend}
						disabled={resendMutation.isPending || !log.templateKey}
					>
						<HugeiconsIcon icon={RefreshIcon} data-icon="inline-start" />
						Resend
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => setDeleteDialogOpen(true)}
						className="text-destructive focus:text-destructive"
					>
						<HugeiconsIcon icon={Delete01Icon} data-icon="inline-start" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete email log</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this email log? This action cannot be undone.
							The original email that was sent will not be affected.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
