"use client";

import { AlertCircleIcon, Loading03Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AccessModelCard } from "@/features/system/components/access-model-card";
import { RolePermissionsCard } from "@/features/system/components/role-permissions-card";
import { useSystemSettingsForm } from "@/features/system/hooks/use-system-settings-form";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "System Settings", isCurrent: true }
];

function LoadingSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
						<Skeleton className="h-16 w-full" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-5 w-40" />
						<Skeleton className="h-4 w-72" />
					</CardHeader>
					<CardContent className="flex flex-col gap-3">
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
						<Skeleton className="h-14 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

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

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<HugeiconsIcon icon={Settings02Icon} className="text-muted-foreground" />
						<h1 className="font-heading text-2xl font-semibold">System Settings</h1>
					</div>
					<p className="text-muted-foreground text-sm">
						Configure access controls and role permissions for your application.
					</p>
				</div>

				<Separator />

				{isLoading && <LoadingSkeleton />}

				{isError && (
					<Alert variant="destructive">
						<HugeiconsIcon icon={AlertCircleIcon} />
						<AlertTitle>Failed to load settings</AlertTitle>
						<AlertDescription className="flex items-center gap-3">
							<span>Unable to retrieve system settings. Please try again.</span>
							<Button variant="outline" size="sm" onClick={() => refetch()}>
								<HugeiconsIcon icon={Loading03Icon} data-icon="inline-start" />
								Retry
							</Button>
						</AlertDescription>
					</Alert>
				)}

				{!isLoading && !isError && settings && (
					<div className="grid gap-6 md:grid-cols-2">
						<AccessModelCard value={accessModel} onChange={setAccessModel} />
						<RolePermissionsCard allowedRoles={allowedRoles} onToggleRole={toggleRole} />
					</div>
				)}

				<div className="bg-background/80 sticky top-0 z-10 flex items-center justify-end gap-3 py-3 backdrop-blur">
					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="sm"
							disabled={!hasChanges || isSaving}
							onClick={handleReset}
						>
							Reset
						</Button>
						<Button size="sm" disabled={!hasChanges || isSaving} onClick={handleSave}>
							{isSaving ? (
								<>
									<HugeiconsIcon icon={Loading03Icon} data-icon="inline-start" />
									Saving...
								</>
							) : (
								"Save Changes"
							)}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

