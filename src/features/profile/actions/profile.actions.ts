import { apiClient } from "@/lib/api/client";

import { apiRoute } from "@/routes/routes";

export interface UpdateProfileInput {
	name: string;
	phone: string;
}

export function updateProfile(data: UpdateProfileInput): Promise<User> {
	return apiClient<User>({
		method: "PUT",
		url: apiRoute.profile,
		data
	});
}

export function updateProfileImage(file: File): Promise<User> {
	const formData = new FormData();
	formData.append("avatar", file);

	return apiClient<User>({
		method: "PUT",
		url: apiRoute.profileImage,
		data: formData
	});
}
