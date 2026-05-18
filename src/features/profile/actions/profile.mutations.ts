import { useMutation } from "@tanstack/react-query";

import { updateProfile, updateProfileImage } from "@/features/profile/actions/profile.actions";

export function useUpdateProfileMutation() {
	return useMutation({
		mutationFn: updateProfile
	});
}

export function useUpdateProfileImageMutation() {
	return useMutation({
		mutationFn: updateProfileImage
	});
}
