export interface TwoFactorStatus {
	enabled: boolean;
	recoveryCodeCount: number;
}

export interface TwoFactorSetupStart {
	otpauthUrl: string;
	qrCodeDataUrl: string;
	manualEntryKey: string;
	expiresAt: string;
}

export interface TwoFactorRecoveryCodes {
	recoveryCodes: string[];
}

export interface TwoFactorVerifyResponse {
	verified: boolean;
}

export interface TwoFactorDisableResponse {
	disabled: boolean;
	revokedOtherSessionCount: number;
}

export interface TwoFactorCodeInput {
	code: string;
}
