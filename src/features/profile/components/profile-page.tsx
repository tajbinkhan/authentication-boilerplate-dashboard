import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Profile", isCurrent: true }
];

export default function ProfilePage() {
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div>Profile Page</div>
		</>
	);
}
