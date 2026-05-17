import { ApiError } from "@/lib/api/errors";

export function getUserErrorMessage(error: unknown): string {
	if (!(error instanceof ApiError)) {
		return "User request failed. Please try again.";
	}

	switch (error.code) {
		case "user_not_found":
			return "That user was not found.";
		case "unauthorized":
			return "Please sign in again to manage users.";
		case "validation_failed":
			return "Some user filters need attention.";
		case "forbidden":
			return "You do not have permission to manage this user.";
		default:
			return error.message || "User request failed. Please try again.";
	}
}
