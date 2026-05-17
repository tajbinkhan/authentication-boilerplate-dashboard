import { ApiError } from "@/lib/api/errors";

export function getSessionErrorMessage(error: unknown): string {
	if (!(error instanceof ApiError)) {
		return "Session request failed. Please try again.";
	}

	switch (error.code) {
		case "session_not_found":
			return "That session was not found or no longer belongs to your account.";
		case "unauthorized":
			return "Please sign in again to manage sessions.";
		case "validation_failed":
			return "Some session filters need attention.";
		case "forbidden":
			return "You do not have permission to manage this session.";
		default:
			return error.message || "Session request failed. Please try again.";
	}
}
