import { format } from "date-fns";

import type { EmailLog } from "@/features/email-logs/types/email-log.types";

const statusLabels: Record<string, string> = {
	sent: "Sent",
	failed: "Failed"
};

export function formatEmailLogStatus(status: string): string {
	return statusLabels[status] ?? status;
}

export function formatEmailLogDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatEmailLogTemplateKey(key: string | null | undefined): string {
	if (!key) return "Raw email";
	return titleize(key);
}

export function formatEmailLogSubject(subject: string): string {
	if (subject.length > 60) {
		return `${subject.slice(0, 57)}...`;
	}
	return subject;
}

export function formatEmailLogMetadataSummary(log: EmailLog): string {
	if (log.status === "failed" && log.errorMessage) {
		return `Failed: ${log.errorMessage}`;
	}
	if (log.templateKey) {
		return `Template: ${formatEmailLogTemplateKey(log.templateKey)}`;
	}
	return "Raw email sent";
}

export function formatShortId(id: string | null | undefined): string {
	if (!id) return "None";
	if (id.length <= 14) return id;
	return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

export function formatMetadataJson(metadata: Record<string, unknown>): string {
	try {
		return JSON.stringify(metadata ?? {}, null, 2);
	} catch {
		return "{}";
	}
}

function titleize(value: string): string {
	return value
		.replace(/[_-]+/g, " ")
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
