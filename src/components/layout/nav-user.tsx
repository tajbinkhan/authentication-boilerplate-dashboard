"use client";

import { Logout03Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import axiosClientApi from "@/lib/client-api";

import { NavUserItemProps, NavUserMaxItemProps } from "@/components/layout/layout.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/components/ui/sidebar";

import { getUserInitials } from "@/core/helper";
import useAuth from "@/hooks/use-auth";
import { apiRoute, route } from "@/routes/routes";

interface NavUserComponentProps {
	items: NavUserMaxItemProps;
}

export function NavUser(props: NavUserComponentProps) {
	const { isMobile } = useSidebar();
	const { user, isAuthenticated } = useAuth();
	const pathname = usePathname();

	if (!isAuthenticated || !user) {
		return null;
	}

	const userName = user.name ? user.name : user.email;
	const userImage = user.image || undefined;

	const handleLogout = async () => {
		await axiosClientApi
			.post(apiRoute.logout)
			.then(() => {
				toast.success("Logged out successfully");
				const redirectLocation =
					route.protected.login +
					"?redirect=" +
					encodeURIComponent(process.env.NEXT_PUBLIC_FRONTEND_URL + pathname);
				window.location.href = redirectLocation;
			})
			.catch(error => {
				toast.error("Failed to log out");
			});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg bg-transparent">
								<AvatarImage src={userImage} alt={userName} />
								<AvatarFallback className="text-foreground rounded-lg bg-transparent">
									{getUserInitials(userName)}
								</AvatarFallback>
							</Avatar>

							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{userName}</span>
								<span className="text-muted-foreground truncate text-xs">{user.email}</span>
							</div>

							<HugeiconsIcon icon={MoreVerticalIcon} className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>

					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="text-foreground h-8 w-8 rounded-lg bg-transparent">
									<AvatarImage src={userImage} alt={userName} />
									<AvatarFallback className="text-foreground rounded-lg bg-transparent">
										{getUserInitials(userName)}
									</AvatarFallback>
								</Avatar>

								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="text-foreground truncate font-medium">{userName}</span>
									<span className="text-muted-foreground truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							{props.items.length > 0 &&
								props.items
									.filter((item): item is NavUserItemProps => item !== undefined)
									.map(item => (
										<DropdownMenuItem key={item.title} asChild>
											<Link href={item.url}>
												<HugeiconsIcon icon={item.icon} />
												{item.title}
											</Link>
										</DropdownMenuItem>
									))}
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuItem onClick={handleLogout}>
							<HugeiconsIcon icon={Logout03Icon} />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
