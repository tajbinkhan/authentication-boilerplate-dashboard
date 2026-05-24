"use client";

import { Loading03Icon, AlertCircleIcon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";
import { AccessModelCard } from "@/features/system/components/access-model-card";
import { RolePermissionsCard } from "@/features/system/components/role-permissions-card";
import { useSystemSettingsForm } from "@/features/system/hooks/use-system-settings-form";
import { useEffect } from "react";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "System Settings", isCurrent: true }
];

export function SystemSettingsPage() {
	const {
		settings,
		isLoading,
		isError,
		refetch,
		accessModel,
		allowedRoles,
		setAccessModel,
		toggleRole,
		hasChanges,
		handleSave,
		handleReset,
		isSaving,
		initialized,
		initialize
	} = useSystemSettingsForm();

	useEffect(() => {
		if (settings && !initialized) {
			initialize(settings);
		}
	}, [settings, initialized, initialize]);

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
					<AccessModelCard value={accessModel} onChange={setAccessModel} />
					<RolePermissionsCard
						allowedRoles={allowedRoles}
						onToggleRole={toggleRole}
						hasChanges={hasChanges}
						isSaving={isSaving}
						onSave={handleSave}
						onReset={handleReset}
					/>
				</div>
			</div>
		</>
	);
}
