import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard",
	description: "Dashboard page of the Next.js boilerplate."
};

export default function Dashboard() {
	return (
		<>
			<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
			<div>Dashboard Content</div>
		</>
	);
}
