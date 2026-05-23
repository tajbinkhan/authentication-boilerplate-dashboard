import { ApiError } from "@/lib/api/errors";

export function getAuditLogErrorMessage(error: unknown): string {
	if (!(error instanceof ApiError)) {
		return "Audit log request failed. Please try again.";
	}

	switch (error.code) {
		case "unauthorized":
			return "Please sign in again to view audit logs.";
		case "forbidden":
			return "You do not have permission to view audit logs.";
		case "validation_failed":
			return "Some audit log filters need attention.";
		default:
			return error.message || "Audit log request failed. Please try again.";
	}
}
