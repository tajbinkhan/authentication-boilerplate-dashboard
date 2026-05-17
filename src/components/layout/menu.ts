import {
	ComputerProtectionIcon,
	DashboardSquare01Icon,
	UserIcon
} from "@hugeicons/core-free-icons";

import type { NavItemProps, NavUserMaxItemProps } from "@/components/layout/layout.types";
import { route } from "@/routes/routes";

const userItems: NavUserMaxItemProps = [
	{
		title: "Profile",
		url: route.private.profile,
		icon: UserIcon
	},
	{
		title: "Sessions",
		url: route.private.sessions,
		icon: ComputerProtectionIcon
	}
];

const navItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: DashboardSquare01Icon
		// items: [{ title: "Profile", url: route.private.profile }],
	}
];

export { navItem, userItems };
