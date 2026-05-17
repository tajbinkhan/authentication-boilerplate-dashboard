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
		magicLinkSuccess: "/auth/magic-link/success",
		twoFactorVerify: "/2fa/verify"
	}
} as const;

export const apiRoute = {
	csrf: "/csrf",
	googleLogin: "/auth/google",
	magicLinkRequest: "/auth/magic-link/request",
	magicLinkVerify: "/auth/magic-link/verify",
	twoFactorStatus: "/auth/2fa/status",
	twoFactorSetupStart: "/auth/2fa/setup/start",
	twoFactorSetupConfirm: "/auth/2fa/setup/confirm",
	twoFactorVerify: "/auth/2fa/verify",
	twoFactorDisable: "/auth/2fa/disable",
	twoFactorRecoveryCodesRegenerate: "/auth/2fa/recovery-codes/regenerate",
	me: "/auth/me",
	logout: "/auth/logout",
	users: "/users",
	user: (id: string) => `/users/${id}`,
	userRole: (id: string) => `/users/${id}/role`,
	userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
	userTwoFactorReset: (id: string) => `/users/${id}/2fa/reset`,
	sessions: "/auth/sessions",
	sessionRevoke: (id: string) => `/auth/sessions/${id}/revoke`,
	revokeOtherSessions: "/auth/sessions/revoke-others"
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
