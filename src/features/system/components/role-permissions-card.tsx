"use client";

import { LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldLegend, FieldSet } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";
import { cn } from "@/lib/utils";

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"];

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
	SUPER_ADMIN: "Full, unrestricted access to settings, databases, and configuration.",
	ADMIN: "Manage users, view server stats, and configure settings.",
	MANAGER: "Moderate access to views, profiles, and listings.",
	USER: "Standard access to user-level dashboards and profile updates."
};

interface RolePermissionsCardProps {
	allowedRoles: UserRole[];
	onToggleRole: (role: UserRole) => void;
}

export function RolePermissionsCard({ allowedRoles, onToggleRole }: RolePermissionsCardProps) {
	return (
		<Card className="border-border/50 pt-0 shadow-sm">
			<CardHeader className="border-border/10 bg-muted/20 border-b pt-6">
				<CardTitle className="text-base font-semibold">Dashboard Access Control</CardTitle>
				<CardDescription>
					Configure which user roles are allowed to authenticate and access the dashboard.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6">
				<FieldSet>
					<FieldLegend className="sr-only">Allowed Roles</FieldLegend>
					<div className="flex flex-col gap-3">
						{ROLES.map(role => {
							const isChecked = allowedRoles.includes(role);
							const isSuperAdmin = role === "SUPER_ADMIN";

							return (
								<div
									key={role}
									className={cn(
										"flex items-center gap-4 rounded-xl border p-4 transition-all",
										isChecked
											? "border-primary/20 bg-muted/30"
											: "border-border/50 hover:bg-muted/10",
										isSuperAdmin && "opacity-80"
									)}
								>
									<Checkbox
										id={`role-${role}`}
										checked={isChecked}
										onCheckedChange={() => onToggleRole(role)}
										disabled={isSuperAdmin}
										className="mt-1 size-5 shrink-0 self-baseline"
									/>
									<div className="flex flex-1 flex-col gap-0.5">
										<div className="flex items-center justify-between gap-2">
											<Label
												htmlFor={`role-${role}`}
												className={cn(
													"text-sm font-semibold",
													isSuperAdmin ? "cursor-default" : "cursor-pointer"
												)}
											>
												{formatUserRole(role)}
											</Label>
											{isSuperAdmin && (
												<span className="text-muted-foreground flex items-center gap-1 text-xs">
													<HugeiconsIcon icon={LockIcon} data-icon="inline-start" />
													Always enabled
												</span>
											)}

											{isChecked && !isSuperAdmin && (
												<span className="text-emerald text-xs">Allowed</span>
											)}
										</div>
										<span className="text-muted-foreground text-xs">{ROLE_DESCRIPTIONS[role]}</span>
									</div>
								</div>
							);
						})}
					</div>
				</FieldSet>
			</CardContent>
		</Card>
	);
}

