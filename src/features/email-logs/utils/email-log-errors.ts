import { ApiError } from "@/lib/api/errors";

export function getEmailLogErrorMessage(error: unknown): string {
	if (!(error instanceof ApiError)) {
		return "Email log request failed. Please try again.";
	}

	switch (error.code) {
		case "unauthorized":
			return "Please sign in again to view email logs.";
		case "forbidden":
			return "You do not have permission to view email logs.";
		case "validation_failed":
			return "Some email log filters need attention.";
		case "email_log_not_found":
			return "This email log no longer exists.";
		case "cannot_resend_raw_email":
			return "Cannot resend: no template is associated with this email.";
		case "email_resend_failed":
			return "Failed to resend the email. Please try again.";
		default:
			return error.message || "Email log request failed. Please try again.";
	}
}
