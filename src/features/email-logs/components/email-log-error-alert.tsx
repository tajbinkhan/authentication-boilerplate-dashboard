import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getEmailLogErrorMessage } from "@/features/email-logs/utils/email-log-errors";

interface EmailLogErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

export function EmailLogErrorAlert({
	error,
	title = "Email log request failed",
	onRetry
}: EmailLogErrorAlertProps) {
	return (
		<Alert variant="destructive" className="py-4">
			<LuCircleAlert className="mt-0.5 shrink-0" />
			<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 space-y-1">
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{getEmailLogErrorMessage(error)}</AlertDescription>
				</div>
				{onRetry ? (
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="w-fit border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
						onClick={onRetry}
					>
						Retry
					</Button>
				) : null}
			</div>
		</Alert>
	);
}
