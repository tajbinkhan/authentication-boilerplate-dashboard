"use client";

import * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu
} from "@/components/ui/sidebar";

import { AppSwitcher } from "@/components/layout/app-switcher";
import {
	navLogsItem,
	navPlatformItem,
	navSMTPItem,
	navSystemItem,
	userItems
} from "@/components/layout/menu";
import { NavMenu } from "@/components/layout/nav-menu";
import { NavUser } from "@/components/layout/nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<AppSwitcher apps={["System 1", "System 2"]} defaultApp={"System 1"} />
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMenu label="Platform" items={navPlatformItem} />
				<NavMenu label="SMTP" items={navSMTPItem} />
				<NavMenu label="Logs" items={navLogsItem} />
				<NavMenu label="System" items={navSystemItem} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser items={userItems} />
			</SidebarFooter>
		</Sidebar>
	);
}
