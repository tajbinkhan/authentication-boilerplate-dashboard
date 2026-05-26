"use client";

import { Refresh01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";

interface EmailTemplateErrorAlertProps {
	error: unknown;
	onRetry: () => void;
}

export function EmailTemplateErrorAlert({ error, onRetry }: EmailTemplateErrorAlertProps) {
	const message = error instanceof Error ? error.message : "Failed to load email templates";

	return (
		<div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
			<p className="text-destructive text-sm">{message}</p>
			<Button type="button" variant="outline" size="sm" onClick={onRetry}>
				<HugeiconsIcon icon={Refresh01Icon} data-icon="inline-start" />
				Retry
			</Button>
		</div>
	);
}
