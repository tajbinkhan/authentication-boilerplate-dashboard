import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { route } from "@/routes/routes";

export function handleRequestError(
	error: unknown,
	router: ReturnType<typeof useRouter>,
	fallback: string
) {
	if (error instanceof ApiError && error.statusCode === 401) {
		toast.error("Please sign in again");
		router.replace(route.protected.login);
		return;
	}

	if (error instanceof ApiError && error.statusCode === 403) {
		return;
	}

	toast.error(error instanceof ApiError ? error.message : fallback);
}
