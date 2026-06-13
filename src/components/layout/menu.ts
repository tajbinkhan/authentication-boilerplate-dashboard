import {
	Audit01Icon,
	ComputerProtectionIcon,
	DashboardSquare01Icon,
	Mail01Icon,
	MailSettingIcon,
	Settings02Icon,
	ShieldKeyIcon,
	UserGroupIcon,
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

const navPlatformItem: NavItemProps[] = [
	{
		title: "Dashboard",
		url: route.private.dashboard,
		icon: DashboardSquare01Icon
		// items: [{ title: "Profile", url: route.private.profile }],
	},
	{
		title: "Users",
		url: route.private.users,
		icon: UserGroupIcon,
		roles: ["admin", "super_admin"]
	}
];

const navSystemItem: NavItemProps[] = [
	{
		title: "System Settings",
		url: route.private.system,
		icon: Settings02Icon,
		roles: ["admin", "super_admin"]
	},
	{
		title: "RBAC",
		url: route.private.rbac,
		icon: ShieldKeyIcon,
		roles: ["super_admin"]
	}
];

const navLogsItem: NavItemProps[] = [
	{
		title: "Email Logs",
		url: route.private.emailLogs,
		icon: Mail01Icon,
		roles: ["admin", "super_admin"]
	},
	{
		title: "Audit Logs",
		url: route.private.auditLogs,
		icon: Audit01Icon,
		roles: ["admin", "super_admin"]
	}
];

const navSMTPItem: NavItemProps[] = [
	{
		title: "SMTP Providers",
		url: route.private.smtpProviders,
		icon: Mail01Icon,
		roles: ["admin", "super_admin"]
	},
	{
		title: "Email Templates",
		url: route.private.emailTemplates,
		icon: MailSettingIcon,
		roles: ["admin", "super_admin"]
	}
];

export { navLogsItem, navPlatformItem, navSMTPItem, navSystemItem, userItems };
