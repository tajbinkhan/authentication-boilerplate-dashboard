import { SetBreadcrumb } from "@/providers/breadcrumb-provider";

export default function Dashboard() {
	return (
		<>
			<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
			<div>Dashboard Content</div>
		</>
	);
}
