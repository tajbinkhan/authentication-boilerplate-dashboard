export const route = {
	public: {
		unauthorized: "/unauthorized",
		magicLinkVerify: "/auth/magic-link/verify"
	},
	private: {
		dashboard: "/",
		profile: "/profile",
		users: "/users",
		sessions: "/sessions",
		auditLogs: "/audit-logs",
		system: "/system",
		smtpProviders: "/smtp-providers",
		emailTemplates: "/email-templates",
		emailTemplateEdit: (publicId: string) => `/email-templates/${publicId}/edit`,
		emailLogs: "/email-logs"
	},
	protected: {
		login: "/login",
		magicLinkSuccess: "/auth/magic-link/success",
		twoFactorVerify: "/2fa/verify"
	}
} as const;

export const apiRoute = {
	csrf: "/csrf",
	passwordLogin: "/auth/login",
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
	profile: "/auth/profile",
	profileImage: "/auth/profile/image",
	logout: "/auth/logout",
	users: "/users",
	user: (id: string) => `/users/${id}`,
	auditLogs: "/audit-logs",
	userRole: (id: string) => `/users/${id}/role`,
	userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
	userTwoFactorReset: (id: string) => `/users/${id}/2fa/reset`,
	sessions: "/auth/sessions",
	sessionRevoke: (id: string) => `/auth/sessions/${id}/revoke`,
	revokeOtherSessions: "/auth/sessions/revoke-others",
	systemSettingsPublic: "/system/settings/public",
	systemSettings: "/system/settings",
	setPassword: "/auth/password/set",
	changePassword: "/auth/password/change",
	smtpProviders: "/smtp-providers",
	smtpProvider: (id: string) => `/smtp-providers/${id}`,
	smtpProviderTest: (id: string) => `/smtp-providers/${id}/test`,
	smtpProviderSetDefault: (id: string) => `/smtp-providers/${id}/set-default`,
	smtpProviderToggle: (id: string) => `/smtp-providers/${id}/toggle`,
	emailTemplates: "/email-templates",
	emailTemplate: (publicId: string) => `/email-templates/${publicId}`,
	emailLogs: "/email-logs",
	emailLog: (logId: string) => `/email-logs/${logId}`,
	emailLogResend: (logId: string) => `/email-logs/${logId}/resend`
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };


