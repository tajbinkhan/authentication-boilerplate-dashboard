"use client";

import {
	Delete02Icon,
	Edit02Icon,
	PlusSignCircleIcon,
	ShieldKeyIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
	useCreateRoleMutation,
	useDeleteRoleMutation,
	useUpdateRoleMutation
} from "@/features/rbac/actions/rbac.mutations";
import { useRolesQuery } from "@/features/rbac/actions/rbac.queries";
import type { Role } from "@/features/rbac/types/rbac.types";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "RBAC", isCurrent: true }
];

export function RbacPage() {
	const rolesQuery = useRolesQuery();
	const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [createOpen, setCreateOpen] = useState(false);
	const deleteRoleMutation = useDeleteRoleMutation();

	const roles = rolesQuery.data?.rows ?? [];
	const activeRole = roles.find(role => role.id === activeRoleId) ?? roles[0] ?? null;

	const handleDeleteRole = (role: Role) => {
		deleteRoleMutation.mutate(role.id, {
			onSuccess: () => {
				toast.success("Role deleted");
				if (activeRoleId === role.id) setActiveRoleId(null);
			},
			onError: error => toast.error(getErrorMessage(error, "Failed to delete role"))
		});
	};

	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="flex items-center gap-2 text-2xl font-semibold tracking-normal">
							<HugeiconsIcon icon={ShieldKeyIcon} className="text-primary size-6" />
							RBAC
						</h1>
						<p className="text-muted-foreground text-sm">Manage table-backed roles.</p>
					</div>
					<Button size="sm" onClick={() => setCreateOpen(true)}>
						<HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
						Create Role
					</Button>
				</div>

				<div className="grid gap-6 lg:grid-cols-[360px_1fr]">
					<Card>
						<CardHeader>
							<CardTitle>Roles</CardTitle>
							<CardDescription>{roles.length} roles configured</CardDescription>
						</CardHeader>
						<CardContent className="flex flex-col gap-2">
							{roles.map(role => {
								const isActive = activeRole?.id === role.id;

								return (
									<div
										key={role.id}
										className={cn(
											"flex min-h-16 items-center justify-between rounded-md border p-3 transition-colors",
											isActive
												? "border-primary/70 bg-primary/10 shadow-[inset_3px_0_0_hsl(var(--primary))]"
												: "hover:bg-muted/40"
										)}
									>
										<button
											type="button"
											className="min-w-0 flex-1 text-left"
											aria-current={isActive ? "true" : undefined}
											onClick={() => setActiveRoleId(role.id)}
										>
											<div className="flex min-w-0 items-center gap-2">
												<span className="truncate text-sm font-medium">
													{formatRoleName(role.name)}
												</span>
												{role.isSystem ? (
													<span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
														System
													</span>
												) : null}
												{isActive ? (
													<span className="bg-primary text-primary-foreground rounded px-1.5 py-0.5 text-[10px] font-medium">
														Active
													</span>
												) : null}
											</div>
											<div className="text-muted-foreground truncate text-xs">
												{role.description ?? "No description"}
											</div>
										</button>
										<div className="flex items-center gap-1">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => setEditingRole(role)}
											>
												<HugeiconsIcon icon={Edit02Icon} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												disabled={role.isSystem || deleteRoleMutation.isPending}
												onClick={() => handleDeleteRole(role)}
											>
												<HugeiconsIcon icon={Delete02Icon} />
											</Button>
										</div>
									</div>
								);
							})}
							{rolesQuery.isLoading ? (
								<p className="text-muted-foreground text-sm">Loading roles...</p>
							) : null}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{activeRole ? formatRoleName(activeRole.name) : "Role Details"}</CardTitle>
							<CardDescription>
								{activeRole?.isSystem
									? "System roles are managed by the seed process."
									: "Review and edit the selected custom role."}
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 text-sm">
							{activeRole ? (
								<>
									<div className="grid gap-1">
										<span className="text-muted-foreground text-xs font-medium uppercase">
											Name
										</span>
										<span>{activeRole.name}</span>
									</div>
									<div className="grid gap-1">
										<span className="text-muted-foreground text-xs font-medium uppercase">
											Description
										</span>
										<span>{activeRole.description ?? "No description"}</span>
									</div>
									<div className="grid gap-1">
										<span className="text-muted-foreground text-xs font-medium uppercase">
											Type
										</span>
										<span>{activeRole.isSystem ? "System" : "Custom"}</span>
									</div>
								</>
							) : (
								<p className="text-muted-foreground">No role selected.</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>

			<RoleFormSheet open={createOpen} onOpenChange={setCreateOpen} />
			<RoleFormSheet
				open={Boolean(editingRole)}
				onOpenChange={open => {
					if (!open) setEditingRole(null);
				}}
				role={editingRole}
			/>
		</>
	);
}

function RoleFormSheet({
	open,
	onOpenChange,
	role
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	role?: Role | null;
}) {
	const createRoleMutation = useCreateRoleMutation();
	const updateRoleMutation = useUpdateRoleMutation();
	const [name, setName] = useState(role?.name ?? "");
	const [description, setDescription] = useState(role?.description ?? "");

	const isEditing = Boolean(role);
	const isPending = createRoleMutation.isPending || updateRoleMutation.isPending;

	const handleSubmit = () => {
		const nextName = name.trim();
		if (!nextName) {
			toast.error("Role name is required");
			return;
		}

		if (isEditing && role) {
			updateRoleMutation.mutate(
				{ id: role.id, name: nextName, description: description.trim() || null },
				{
					onSuccess: () => {
						toast.success("Role updated");
						onOpenChange(false);
					},
					onError: error => toast.error(getErrorMessage(error, "Failed to update role"))
				}
			);
			return;
		}

		createRoleMutation.mutate(
			{ name: nextName, description: description.trim() || null },
			{
				onSuccess: () => {
					toast.success("Role created");
					onOpenChange(false);
				},
				onError: error => toast.error(getErrorMessage(error, "Failed to create role"))
			}
		);
	};

	return (
		<Sheet
			open={open}
			onOpenChange={nextOpen => {
				if (nextOpen) {
					setName(role?.name ?? "");
					setDescription(role?.description ?? "");
				}
				onOpenChange(nextOpen);
			}}
		>
			<SheetContent className="flex flex-col sm:max-w-xl">
				<SheetHeader>
					<SheetTitle>{isEditing ? "Edit Role" : "Create Role"}</SheetTitle>
				</SheetHeader>
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
					<div className="grid gap-2">
						<Label htmlFor="rbac-role-name">Name</Label>
						<Input
							id="rbac-role-name"
							value={name}
							onChange={event => setName(event.currentTarget.value)}
							disabled={isPending || role?.isSystem}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="rbac-role-description">Description</Label>
						<Textarea
							id="rbac-role-description"
							value={description}
							onChange={event => setDescription(event.currentTarget.value)}
							disabled={isPending}
						/>
					</div>
				</div>
				<SheetFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isPending || Boolean(role?.isSystem && name !== role.name)}
					>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function formatRoleName(value: string): string {
	return value
		.split("_")
		.map(part => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof ApiError ? error.message : fallback;
}
