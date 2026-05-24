"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"];

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
	SUPER_ADMIN:
		"Super administrator with full, unrestricted access to settings, databases, and configuration.",
	ADMIN: "Administrators who can manage users, view server stats, and configure settings.",
	MANAGER: "Managers who have moderate access to views, profiles, and listings.",
	USER: "Standard users who can access user-level dashboards and update their profiles."
};

interface RolePermissionsCardProps {
	allowedRoles: UserRole[];
	onToggleRole: (role: UserRole) => void;
	hasChanges: boolean;
	isSaving: boolean;
	onSave: () => void;
	onReset: () => void;
}

export function RolePermissionsCard({
	allowedRoles,
	onToggleRole,
	hasChanges,
	isSaving,
	onSave,
	onReset
}: RolePermissionsCardProps) {
	return (
		<Card className="border-border/50 overflow-hidden shadow-sm">
			<CardHeader className="border-border/10 bg-muted/20 border-b">
				<CardTitle className="text-base font-semibold">Dashboard Access Control</CardTitle>
				<CardDescription>
					Configure which user roles are allowed to authenticate and access the dashboard.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6">
				<div className="grid gap-4">
					{ROLES.map(role => {
						const isChecked = allowedRoles.includes(role);
						const isSuperAdmin = role === "SUPER_ADMIN";

						return (
							<div
								key={role}
								onClick={() => onToggleRole(role)}
								className={cn(
									"flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-200",
									isChecked
										? "bg-muted/30 border-primary/20"
										: "border-border/50 hover:bg-muted/10",
									isSuperAdmin && "cursor-default opacity-75"
								)}
							>
								<div className="flex flex-col gap-0.5">
									<span className="text-sm font-semibold">{formatUserRole(role)}</span>
									<span className="text-muted-foreground text-xs">
										{ROLE_DESCRIPTIONS[role]}
									</span>
								</div>
								<div onClick={e => e.stopPropagation()} className="pl-4">
									<Checkbox
										id={`role-${role}`}
										checked={isChecked}
										onCheckedChange={() => onToggleRole(role)}
										disabled={isSuperAdmin}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
			<CardFooter className="bg-muted/5 border-border/10 flex justify-end gap-3 border-t p-6">
				<Button
					type="button"
					variant="outline"
					disabled={!hasChanges || isSaving}
					onClick={onReset}
				>
					Reset
				</Button>
				<Button type="button" disabled={!hasChanges || isSaving} onClick={onSave}>
					{isSaving ? "Saving Settings" : "Save Changes"}
				</Button>
			</CardFooter>
		</Card>
	);
}
