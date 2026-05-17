import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
	confirmTwoFactorSetup,
	disableTwoFactor,
	regenerateTwoFactorRecoveryCodes,
	startTwoFactorSetup,
	verifyTwoFactor
} from "@/features/auth/two-factor/actions/two-factor.actions";
import { twoFactorKeys } from "@/features/auth/two-factor/actions/two-factor.keys";

function useInvalidateTwoFactorStatus() {
	const queryClient = useQueryClient();

	return async () => {
		await queryClient.invalidateQueries({ queryKey: twoFactorKeys.all });
	};
}

export function useStartTwoFactorSetupMutation() {
	return useMutation({
		mutationFn: startTwoFactorSetup
	});
}

export function useConfirmTwoFactorSetupMutation() {
	const invalidate = useInvalidateTwoFactorStatus();

	return useMutation({
		mutationFn: confirmTwoFactorSetup,
		onSuccess: invalidate
	});
}

export function useVerifyTwoFactorMutation() {
	return useMutation({
		mutationFn: verifyTwoFactor
	});
}

export function useDisableTwoFactorMutation() {
	const invalidate = useInvalidateTwoFactorStatus();

	return useMutation({
		mutationFn: disableTwoFactor,
		onSuccess: invalidate
	});
}

export function useRegenerateTwoFactorRecoveryCodesMutation() {
	const invalidate = useInvalidateTwoFactorStatus();

	return useMutation({
		mutationFn: regenerateTwoFactorRecoveryCodes,
		onSuccess: invalidate
	});
}
