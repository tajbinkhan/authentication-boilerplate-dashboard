"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from "@/components/ui/sidebar";

import { NavItemProps } from "@/components/layout/layout.types";

interface NavMenuProps {
	label: string;
	items: NavItemProps[];
}

export function NavMenu(props: NavMenuProps) {
	const pathname = usePathname();

	const isActive = (items?: NavItemProps["items"]) => {
		if (items) {
			const isActive = items.some(subItem => subItem.url === pathname);
			return isActive;
		}
		return false;
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{props.label}</SidebarGroupLabel>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					{props.items.map(item => (
						<Collapsible key={item.title} asChild defaultOpen={isActive(item.items)}>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									tooltip={item.title}
									isActive={item.url === pathname || isActive(item.items)}
								>
									<Link href={item.url}>
										<HugeiconsIcon icon={item.icon} />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>

								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className="data-[state=open]:rotate-90">
												<HugeiconsIcon icon={ArrowRight01Icon} />
												<span className="sr-only">Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>

										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items.map(subItem => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild isActive={subItem.url === pathname}>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
