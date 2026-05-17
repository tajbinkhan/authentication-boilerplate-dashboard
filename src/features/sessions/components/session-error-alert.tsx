import { LuCircleAlert } from "react-icons/lu";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getSessionErrorMessage } from "@/features/sessions/utils/session-errors";

interface SessionErrorAlertProps {
	error: unknown;
	title?: string;
	onRetry?: () => void;
}

export function SessionErrorAlert({
	error,
	title = "Session request failed",
	onRetry
}: SessionErrorAlertProps) {
	return (
		<Alert variant="destructive">
			<LuCircleAlert />
			<AlertTitle>{title}</AlertTitle>
			<AlertDescription>{getSessionErrorMessage(error)}</AlertDescription>
			{onRetry ? (
				<div className="mt-2">
					<Button type="button" variant="outline" size="sm" onClick={onRetry}>
						Retry
					</Button>
				</div>
			) : null}
		</Alert>
	);
}

