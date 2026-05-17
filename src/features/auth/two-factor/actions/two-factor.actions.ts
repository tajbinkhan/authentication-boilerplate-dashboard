import { apiClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import type {
	TwoFactorCodeInput,
	TwoFactorDisableResponse,
	TwoFactorRecoveryCodes,
	TwoFactorSetupStart,
	TwoFactorStatus,
	TwoFactorVerifyResponse
} from "@/features/auth/two-factor/types/two-factor.types";

export function getTwoFactorStatus(): Promise<TwoFactorStatus> {
	return apiClient<TwoFactorStatus>({
		method: "GET",
		url: apiRoute.twoFactorStatus
	});
}

export function startTwoFactorSetup(): Promise<TwoFactorSetupStart> {
	return apiClient<TwoFactorSetupStart>({
		method: "POST",
		url: apiRoute.twoFactorSetupStart
	});
}

export function confirmTwoFactorSetup({
	code
}: TwoFactorCodeInput): Promise<TwoFactorRecoveryCodes> {
	return apiClient<TwoFactorRecoveryCodes>({
		method: "POST",
		url: apiRoute.twoFactorSetupConfirm,
		data: { code }
	});
}

export function verifyTwoFactor({ code }: TwoFactorCodeInput): Promise<TwoFactorVerifyResponse> {
	return apiClient<TwoFactorVerifyResponse>({
		method: "POST",
		url: apiRoute.twoFactorVerify,
		data: { code }
	});
}

export function disableTwoFactor({
	code
}: TwoFactorCodeInput): Promise<TwoFactorDisableResponse> {
	return apiClient<TwoFactorDisableResponse>({
		method: "POST",
		url: apiRoute.twoFactorDisable,
		data: { code }
	});
}

export function regenerateTwoFactorRecoveryCodes({
	code
}: TwoFactorCodeInput): Promise<TwoFactorRecoveryCodes> {
	return apiClient<TwoFactorRecoveryCodes>({
		method: "POST",
		url: apiRoute.twoFactorRecoveryCodesRegenerate,
		data: { code }
	});
}
