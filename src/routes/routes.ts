export const route = {
	public: {
		unauthorized: "/unauthorized",
		magicLinkVerify: "/auth/magic-link/verify"
	},
	private: {
		dashboard: "/",
		profile: "/profile",
		users: "/users",
		sessions: "/sessions"
	},
	protected: {
		login: "/login",
		magicLinkSuccess: "/auth/magic-link/success"
	}
} as const;

export const apiRoute = {
	csrf: "/csrf",
	googleLogin: "/auth/google",
	magicLinkRequest: "/auth/magic-link/request",
	magicLinkVerify: "/auth/magic-link/verify",
	me: "/auth/me",
	logout: "/auth/logout",
	users: "/users",
	userRole: (id: string) => `/users/${id}/role`,
	userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
	sessions: "/auth/sessions",
	sessionRevoke: (id: string) => `/auth/sessions/${id}/revoke`,
	revokeOtherSessions: "/auth/sessions/revoke-others"
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
