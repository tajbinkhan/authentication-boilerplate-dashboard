import { format } from "date-fns";

import type { EmailProviderType } from "@/features/smtp-providers/types/smtp-provider.types";

export function formatSmtpProviderDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function getProviderTypeBadgeVariant(type: EmailProviderType): "default" | "secondary" | "destructive" | "outline" {
	switch (type) {
		case "brevo":
			return "default";
		case "resend":
			return "secondary";
		case "nodemailer":
			return "outline";
		case "aws-ses":
			return "destructive";
	}
}
