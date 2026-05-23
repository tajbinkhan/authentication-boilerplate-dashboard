export {};

declare global {
	interface User {
		id: string;
		publicId: string;
		name: string | null;
		email: string;
		emailVerified: boolean;
		image: string | null;
		phone: string | null;
		is2faEnabled: boolean;
		role: string;
		isApproved: boolean;
		hasPassword: boolean;
		createdAt: string;
		updatedAt: string;
	}
}
