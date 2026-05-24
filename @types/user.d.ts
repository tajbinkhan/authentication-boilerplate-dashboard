interface User {
	id: string;
	publicId: string;
	name: string | null;
	email: string;
	emailVerified: boolean;
	image: string | null;
	phone: string | null;
	is2faEnabled: boolean;
	hasPassword: boolean;
	role: "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
	isApproved: boolean;
	createdAt: string;
	updatedAt: string;
}
