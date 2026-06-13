export interface TwoFactorStatus {
	enabled: boolean;
	recoveryCodeCount: number;
}

export interface TwoFactorSetupStart {
	totpURI: string;
	backupCodes: string[];
}

export interface TwoFactorSetupConfirmResponse {
	user: unknown;
}

export interface TwoFactorRecoveryCodes {
	recoveryCodes: string[];
}

export interface TwoFactorVerifyResponse {
	verified: boolean;
}

export interface TwoFactorDisableResponse {
	status: boolean;
}

export interface TwoFactorCodeInput {
	code: string;
}
