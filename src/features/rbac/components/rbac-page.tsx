"use client";

import {
	Delete02Icon,
	Edit02Icon,
	PlusSignCircleIcon,
	ShieldKeyIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useRolesQuery, usePermissionsQuery } from "@/features/rbac/actions/rbac.queries";
import {
	useCreateRoleMutation,
	useDeleteRoleMutation,
	useUpdateRoleMutation,
	useUpdateRolePermissionsMutation
} from "@/features/rbac/actions/rbac.mutations";
import type { Permission, Role } from "@/features/rbac/types/rbac.types";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "RBAC", isCurrent: true }
];

export function RbacPage() {
	const rolesQuery = useRolesQuery();
	const permissionsQuery = usePermissionsQuery();
	const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
	const [editingRole, setEditingRole] = useState<Role | null>(null);
	const [createOpen, setCreateOpen] = useState(false);
	const updatePermissionsMutation = useUpdateRolePermissionsMutation();
	const deleteRoleMutation = useDeleteRoleMutation();

	const roles = useMemo(() => rolesQuery.data?.rows ?? [], [rolesQuery.data?.rows]);
	const permissions = useMemo(
		() => permissionsQuery.data?.rows ?? [],
		[permissionsQuery.data?.rows]
	);
	const activeRole = roles.find(role => role.id === activeRoleId) ?? roles[0] ?? null;
	const groupedPermissions = useMemo(() => groupPermissions(permissions), [permissions]);
	const activePermissionIds = new Set(activeRole?.permissions.map(permission => permission.id) ?? []);

	const handleTogglePermission = (permissionId: string, checked: boolean) => {
		if (!activeRole || activeRole.isSystem) return;

		const next = new Set(activePermissionIds);
		if (checked) {
			next.add(permissionId);
		} else {
			next.delete(permissionId);
		}

		updatePermissionsMutation.mutate(
			{ id: activeRole.id, permissionIds: [...next] },
			{
				onSuccess: () => toast.success("Permissions updated"),
				onError: error => toast.error(getErrorMessage(error, "Failed to update permissions"))
			}
		);
	};

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
						<p className="text-muted-foreground text-sm">
							Manage table-backed roles and permission assignments.
						</p>
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
							{rolesQuery.isLoading ? <p className="text-muted-foreground text-sm">Loading roles...</p> : null}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{activeRole ? formatRoleName(activeRole.name) : "Permissions"}</CardTitle>
							<CardDescription>
								{activeRole?.isSystem
									? "System role permissions are seed-managed."
									: "Toggle permissions for the selected custom role."}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ScrollArea className="h-[620px] pr-3">
								<div className="grid gap-4">
									{groupedPermissions.map(group => (
										<div key={group.resource} className="rounded-md border">
											<div className="bg-muted/30 border-b px-3 py-2 text-sm font-medium">
												{formatRoleName(group.resource)}
											</div>
											<div className="grid gap-2 p-3">
												{group.permissions.map(permission => (
													<label
														key={permission.id}
														className="flex items-start gap-3 rounded-md p-2 hover:bg-muted/30"
													>
														<Checkbox
															checked={activePermissionIds.has(permission.id)}
															disabled={!activeRole || activeRole.isSystem}
															onCheckedChange={checked =>
																handleTogglePermission(permission.id, checked === true)
															}
														/>
														<span className="grid gap-0.5">
															<span className="text-sm font-medium">{permission.name}</span>
															<span className="text-muted-foreground text-xs">
																{permission.description}
															</span>
														</span>
													</label>
												))}
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						</CardContent>
					</Card>
				</div>
			</div>

			<RoleFormSheet open={createOpen} onOpenChange={setCreateOpen} permissions={permissions} />
			<RoleFormSheet
				open={Boolean(editingRole)}
				onOpenChange={open => {
					if (!open) setEditingRole(null);
				}}
				role={editingRole}
				permissions={permissions}
			/>
		</>
	);
}

function RoleFormSheet({
	open,
	onOpenChange,
	role,
	permissions
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	role?: Role | null;
	permissions: Permission[];
}) {
	const createRoleMutation = useCreateRoleMutation();
	const updateRoleMutation = useUpdateRoleMutation();
	const [name, setName] = useState(role?.name ?? "");
	const [description, setDescription] = useState(role?.description ?? "");
	const [permissionIds, setPermissionIds] = useState<string[]>(role?.permissions.map(item => item.id) ?? []);

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
			{ name: nextName, description: description.trim() || null, permissionIds },
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
					setPermissionIds(role?.permissions.map(item => item.id) ?? []);
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
					{!isEditing ? (
						<div className="grid gap-2">
							<Label>Initial Permissions</Label>
							<div className="grid max-h-72 gap-2 overflow-y-auto rounded-md border p-2">
								{permissions.map(permission => (
									<label key={permission.id} className="flex items-start gap-2 p-1">
										<Checkbox
											checked={permissionIds.includes(permission.id)}
											onCheckedChange={checked => {
												setPermissionIds(current =>
													checked === true
														? [...new Set([...current, permission.id])]
														: current.filter(id => id !== permission.id)
												);
											}}
										/>
										<span className="text-sm">{permission.name}</span>
									</label>
								))}
							</div>
						</div>
					) : null}
				</div>
				<SheetFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isPending || Boolean(role?.isSystem && name !== role.name)}>
						{isPending ? "Saving..." : "Save"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function groupPermissions(permissions: Permission[]) {
	const groups = new Map<string, Permission[]>();
	for (const permission of permissions) {
		const current = groups.get(permission.resource) ?? [];
		current.push(permission);
		groups.set(permission.resource, current);
	}

	return [...groups.entries()].map(([resource, groupPermissions]) => ({
		resource,
		permissions: groupPermissions
	}));
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
