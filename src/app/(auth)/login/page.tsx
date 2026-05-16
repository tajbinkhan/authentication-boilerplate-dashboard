import type { Metadata } from "next";

import { LoginPage } from "@/features/auth/login/login-page";

export const metadata: Metadata = {
	title: "Login",
	description: "Access your account and manage your dashboard with ease."
};

export default function Login() {
	return <LoginPage />;
}
