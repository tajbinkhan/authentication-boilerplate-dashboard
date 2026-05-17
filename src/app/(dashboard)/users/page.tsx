import { UsersPage } from "@/features/users/components/users-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Users",
	description: "Users page of the Next.js boilerplate."
};

export default function Users() {
	return <UsersPage />;
}

