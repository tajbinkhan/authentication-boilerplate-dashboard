import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getUserErrorMessage } from "@/features/users/utils/user-errors";

interface UserErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

export function UserErrorAlert({
	error,
	title = "User request failed",
	onRetry
}: UserErrorAlertProps) {
	return (
		<Alert variant="destructive" className="py-4">
			<LuCircleAlert className="mt-0.5 shrink-0" />
			<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="min-w-0 space-y-1">
					<AlertTitle>{title}</AlertTitle>
					<AlertDescription>{getUserErrorMessage(error)}</AlertDescription>
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
