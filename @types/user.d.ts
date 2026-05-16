interface User {
	id: number;
	name: string | null;
	publicId: string;
	email: string;
	password: string | null;
	emailVerified: boolean;
	image: string | null;
	phone: string | null;
	is2faEnabled: boolean;
	role: "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
	createdAt: string;
	updatedAt: string;
}
