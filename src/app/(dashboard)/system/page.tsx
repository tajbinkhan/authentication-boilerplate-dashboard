import { SystemSettingsPage } from "@/features/system/components/system-settings-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "System Settings",
	description: "System access control settings of the Next.js boilerplate."
};

export default function System() {
	return <SystemSettingsPage />;
}
