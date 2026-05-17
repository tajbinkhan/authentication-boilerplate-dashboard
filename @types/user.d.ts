interface User {
	id: string;
	name: string | null;
	email: string;
	emailVerified: boolean;
	image: string | null;
	phone: string | null;
	is2faEnabled: boolean;
	role: "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
	createdAt: string;
	updatedAt: string;
}
