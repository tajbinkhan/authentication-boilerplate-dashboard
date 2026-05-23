"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/core/helper";
import { useUserQuery } from "@/features/users/actions/users.queries";
import { UserErrorAlert } from "@/features/users/components/user-error-alert";
import type { ManagedUser, UserRole } from "@/features/users/types/users.types";
import { formatUserDate, formatUserRole } from "@/features/users/utils/user-format";

interface UserDetailsDialogProps {
	user: ManagedUser;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
	const userQuery = useUserQuery(user.id, open);
	const detailUser = userQuery.data ?? user;
	const displayName = detailUser.name || detailUser.email;
	const showSkeleton = userQuery.isLoading && !userQuery.data;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>User details</DialogTitle>
					<DialogDescription>{user.email}</DialogDescription>
				</DialogHeader>

				<div className="grid gap-5">
					{userQuery.error ? (
						<UserErrorAlert
							error={userQuery.error}
							title="Failed to load user details"
							onRetry={() => {
								void userQuery.refetch();
							}}
						/>
					) : null}

					{showSkeleton ? (
						<UserDetailsSkeleton />
					) : (
						<>
							<section className="flex min-w-0 items-start gap-4">
								<Avatar className="size-12">
									<AvatarImage src={detailUser.image ?? undefined} alt={displayName} />
									<AvatarFallback>{getUserInitials(displayName)}</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<div className="truncate text-base font-medium">{displayName}</div>
									<div className="text-muted-foreground truncate text-sm">{detailUser.email}</div>
									<div className="mt-2 flex flex-wrap gap-2">
										<UserRoleBadge role={detailUser.role} />
										<UserApprovalBadge approved={detailUser.isApproved} />
										<Badge variant={detailUser.emailVerified ? "default" : "secondary"}>
											{detailUser.emailVerified ? "Email verified" : "Email unverified"}
										</Badge>
										<Badge variant={detailUser.is2faEnabled ? "outline" : "secondary"}>
											{detailUser.is2faEnabled ? "2FA enabled" : "2FA off"}
										</Badge>
									</div>
								</div>
							</section>

							<Separator />

							<section className="grid gap-3">
								<h3 className="text-sm font-medium">Account identity</h3>
								<div className="grid gap-3 sm:grid-cols-2">
									<DetailItem label="User ID" value={detailUser.id} />
									<DetailItem label="Name" value={detailUser.name ?? "Not set"} />
									<DetailItem label="Email" value={detailUser.email} />
									<DetailItem label="Phone" value={detailUser.phone ?? "Not set"} />
								</div>
							</section>

							<Separator />

							<section className="grid gap-3">
								<h3 className="text-sm font-medium">Access and sessions</h3>
								<div className="grid gap-3 sm:grid-cols-2">
									<DetailItem label="Role" value={formatUserRole(detailUser.role)} />
									<DetailItem
										label="Approval"
										value={detailUser.isApproved ? "Approved" : "Pending"}
									/>
									<DetailItem
										label="Two-factor authentication"
										value={detailUser.is2faEnabled ? "Enabled" : "Off"}
									/>
									<DetailItem
										label="Active sessions"
										value={`${detailUser.activeSessionCount} active session${
											detailUser.activeSessionCount === 1 ? "" : "s"
										}`}
									/>
								</div>
							</section>

							<Separator />

							<section className="grid gap-3">
								<h3 className="text-sm font-medium">Timestamps</h3>
								<div className="grid gap-3 sm:grid-cols-2">
									<DetailItem label="Created" value={formatUserDate(detailUser.createdAt)} />
									<DetailItem label="Updated" value={formatUserDate(detailUser.updatedAt)} />
								</div>
							</section>
						</>
					)}
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function DetailItem({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<div className="text-muted-foreground text-xs">{label}</div>
			<div className="text-sm wrap-break-word">{value}</div>
		</div>
	);
}

function UserRoleBadge({ role }: { role: UserRole }) {
	const variant =
		role === "SUPER_ADMIN" ? "destructive" : role === "ADMIN" ? "default" : "secondary";

	return <Badge variant={variant}>{formatUserRole(role)}</Badge>;
}

function UserApprovalBadge({ approved }: { approved: boolean }) {
	return approved ? (
		<Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
			Approved
		</Badge>
	) : (
		<Badge className="border-amber-500/20 bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
			Pending
		</Badge>
	);
}

function UserDetailsSkeleton() {
	return (
		<div className="grid gap-5">
			<div className="flex items-start gap-4">
				<Skeleton className="size-12 rounded-full" />
				<div className="grid flex-1 gap-2">
					<Skeleton className="h-5 w-48" />
					<Skeleton className="h-4 w-64 max-w-full" />
					<div className="flex gap-2">
						<Skeleton className="h-5 w-20" />
						<Skeleton className="h-5 w-24" />
						<Skeleton className="h-5 w-24" />
					</div>
				</div>
			</div>
			<Separator />
			<div className="grid gap-3 sm:grid-cols-2">
				{Array.from({ length: 8 }).map((_, index) => (
					<div key={index} className="grid gap-1">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-4 w-full max-w-52" />
					</div>
				))}
			</div>
		</div>
	);
}

