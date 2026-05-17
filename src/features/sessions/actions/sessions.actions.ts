import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createSessionListQuery } from "@/features/sessions/schemas/sessions-api.schema";
import type {
	RevokeOtherSessionsResponse,
	Session,
	SessionListQuery,
	SessionListResponse
} from "@/features/sessions/types/sessions.types";

export async function listSessions(filters: SessionListQuery): Promise<SessionListResponse> {
	return apiClient<SessionListResponse>({
		method: "GET",
		url: apiRoute.sessions,
		params: createSessionListQuery(filters)
	});
}

export async function revokeSession(id: string): Promise<Session> {
	return apiClient<Session>({
		method: "POST",
		url: apiRoute.sessionRevoke(id)
	});
}

export async function revokeOtherSessions(): Promise<RevokeOtherSessionsResponse> {
	return apiClient<RevokeOtherSessionsResponse>({
		method: "POST",
		url: apiRoute.revokeOtherSessions
	});
}
