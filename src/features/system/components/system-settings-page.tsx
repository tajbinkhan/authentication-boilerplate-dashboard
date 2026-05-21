"use client";

import {
	AlertCircleIcon,
	Loading03Icon,
	Settings02Icon,
	ShieldKeyIcon,
	Tick02Icon,
	UserAdd01Icon,
	UserGroupIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { UserRole } from "@/features/users/types/users.types";
import { formatUserRole } from "@/features/users/utils/user-format";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";
import { useUpdateSystemSettingsMutation } from "../actions/system.mutations";
import { useSystemSettingsQuery } from "../actions/system.queries";
import type { AccessModel, SystemSettings } from "../types/system.types";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "System Settings", isCurrent: true }
];

const ACCESS_MODELS = [
	{
		id: "OPEN" as AccessModel,
		title: "Open Registration",
		description: "Anyone can sign up and gain access to the system immediately.",
		icon: UserAdd01Icon,
		gradient: "from-emerald-500/10 to-teal-500/10",
		borderSelected: "border-emerald-500/50 dark:border-emerald-400/50",
		accentColor: "text-emerald-500"
	},
	{
		id: "APPROVAL_BASED" as AccessModel,
		title: "Approval-Based",
		description:
			"Users can register, but an administrator must manually approve their account before they can sign in.",
		icon: UserGroupIcon,
		gradient: "from-amber-500/10 to-orange-500/10",
		borderSelected: "border-amber-500/50 dark:border-amber-400/50",
		accentColor: "text-amber-500"
	},
	{
		id: "CLOSED" as AccessModel,
		title: "Closed / Private",
		description:
			"Self-registration is disabled. Only pre-created accounts can request a login magic link.",
		icon: ShieldKeyIcon,
		gradient: "from-rose-500/10 to-pink-500/10",
		borderSelected: "border-rose-500/50 dark:border-rose-400/50",
		accentColor: "text-rose-500"
	}
];

const ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"];

export function SystemSettingsPage() {
	const { data: settings, isLoading, isError, refetch } = useSystemSettingsQuery();

	if (isLoading) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<div className="flex h-[50vh] items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<HugeiconsIcon icon={Loading03Icon} className="text-primary size-8 animate-spin" />
						<p className="text-muted-foreground text-sm">Loading system settings...</p>
					</div>
				</div>
			</>
		);
	}

	if (isError) {
		return (
			<>
				<SetBreadcrumb items={breadcrumbItems} />
				<div className="flex h-[50vh] items-center justify-center">
					<div className="flex flex-col items-center gap-3">
						<HugeiconsIcon icon={AlertCircleIcon} className="text-destructive size-8" />
						<p className="text-muted-foreground text-sm">Failed to load system settings.</p>
						<Button variant="outline" onClick={() => refetch()}>
							Retry
						</Button>
					</div>
				</div>
			</>
		);
	}

	if (!settings) {
		return null;
	}

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<SystemSettingsForm
				key={`${settings.accessModel}-${settings.allowedRoles.join(",")}`}
				settings={settings}
			/>
		</>
	);
}

interface SystemSettingsFormProps {
	settings: SystemSettings;
}

function SystemSettingsForm({ settings }: SystemSettingsFormProps) {
	const updateMutation = useUpdateSystemSettingsMutation();

	const [accessModel, setAccessModel] = useState<AccessModel>(settings.accessModel);
	const [allowedRoles, setAllowedRoles] = useState<UserRole[]>(settings.allowedRoles);

	const handleSave = () => {
		updateMutation.mutate(
			{
				accessModel,
				allowedRoles
			},
			{
				onSuccess: () => {
					toast.success("System settings updated successfully");
				},
				onError: error => {
					const message = error instanceof ApiError ? error.message : "Failed to update settings";
					toast.error(message);
				}
			}
		);
	};

	const toggleRole = (role: UserRole) => {
		if (role === "SUPER_ADMIN") return; // Super admin cannot be removed

		setAllowedRoles(prev => (prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]));
	};

	const hasChanges =
		settings.accessModel !== accessModel ||
		settings.allowedRoles.length !== allowedRoles.length ||
		!settings.allowedRoles.every(r => allowedRoles.includes(r));

	return (
		<div className="mx-auto flex flex-col gap-6">
			<div>
				<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
					<HugeiconsIcon icon={Settings02Icon} className="text-primary size-6" />
					System Settings
				</h1>
				<p className="text-muted-foreground mt-1 text-sm">
					Manage registration access controls and configure role-based permissions for dashboard
					access.
				</p>
			</div>

			<div className="grid gap-6">
				{/* Access Model Card */}
				<Card className="border-border/50 overflow-hidden shadow-sm">
					<CardHeader className="border-border/10 bg-muted/20 border-b">
						<CardTitle className="text-base font-semibold">Access Model</CardTitle>
						<CardDescription>
							Control how new users register and sign in to the application.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-4 p-6 sm:grid-cols-3">
						{ACCESS_MODELS.map(model => {
							const isSelected = accessModel === model.id;
							const Icon = model.icon;

							return (
								<button
									key={model.id}
									type="button"
									onClick={() => setAccessModel(model.id)}
									className={cn(
										"relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-md focus:outline-none",
										isSelected
											? cn("bg-linear-to-br shadow-inner", model.gradient, model.borderSelected)
											: "border-border/60 hover:border-border"
									)}
								>
									<div className="mb-3 flex w-full items-center justify-between">
										<div
											className={cn(
												"bg-background border-border/20 rounded-xl border p-2 shadow-sm",
												model.accentColor
											)}
										>
											<HugeiconsIcon icon={Icon} className="size-5" />
										</div>
										{isSelected && (
											<div
												className={cn(
													"bg-background flex size-5 items-center justify-center rounded-full border shadow-sm",
													model.accentColor,
													model.borderSelected
												)}
											>
												<HugeiconsIcon icon={Tick02Icon} className="size-3" />
											</div>
										)}
									</div>
									<h3 className="mb-1 text-sm font-semibold">{model.title}</h3>
									<p className="text-muted-foreground text-xs leading-relaxed">
										{model.description}
									</p>
								</button>
							);
						})}
					</CardContent>
				</Card>

				{/* Dashboard Role Permissions */}
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
										onClick={() => toggleRole(role)}
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
												{isSuperAdmin
													? "Super administrator with full, unrestricted access to settings, databases, and configuration."
													: role === "ADMIN"
														? "Administrators who can manage users, view server stats, and configure settings."
														: role === "MANAGER"
															? "Managers who have moderate access to views, profiles, and listings."
															: "Standard users who can access user-level dashboards and update their profiles."}
											</span>
										</div>
										<div onClick={e => e.stopPropagation()} className="pl-4">
											<Checkbox
												id={`role-${role}`}
												checked={isChecked}
												onCheckedChange={() => toggleRole(role)}
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
							disabled={!hasChanges || updateMutation.isPending}
							onClick={() => {
								setAccessModel(settings.accessModel);
								setAllowedRoles(settings.allowedRoles);
							}}
						>
							Reset
						</Button>
						<Button
							type="button"
							disabled={!hasChanges || updateMutation.isPending}
							onClick={handleSave}
							className="gap-2"
						>
							{updateMutation.isPending ? (
								<>
									<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
									Saving Settings
								</>
							) : (
								<>
									<HugeiconsIcon icon={Tick02Icon} className="size-4" />
									Save Changes
								</>
							)}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

