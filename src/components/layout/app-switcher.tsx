"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import * as React from "react";
import { FaCheck, FaLayerGroup } from "react-icons/fa";
import { HiChevronUpDown } from "react-icons/hi2";

export function AppSwitcher({ apps, defaultApp }: { apps: string[]; defaultApp: string }) {
	const [selectedApp, setSelectedApp] = React.useState(defaultApp);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
								<FaLayerGroup className="size-4" />
							</div>
							<div className="flex flex-col gap-0.5 leading-none">
								<span className="font-medium">Dashboard</span>
								<span className="">{selectedApp}</span>
							</div>
							<HiChevronUpDown className="ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)" align="start">
						{apps.map(app => (
							<DropdownMenuItem key={app} onSelect={() => setSelectedApp(app)}>
								{app} {app === selectedApp && <FaCheck className="ml-auto" />}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
