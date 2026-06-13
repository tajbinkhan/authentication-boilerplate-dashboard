import { Metadata } from "next";

import { RbacPage } from "@/features/rbac/components/rbac-page";

export const metadata: Metadata = {
	title: "RBAC",
	description: "Manage roles and permissions."
};

export default function Page() {
	return <RbacPage />;
}

