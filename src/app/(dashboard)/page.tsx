import { DashboardPage } from "@/features/dashboard/components/dashboard-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard overview of your account and security status."
};

export default function Dashboard() {
	return <DashboardPage />;
}
