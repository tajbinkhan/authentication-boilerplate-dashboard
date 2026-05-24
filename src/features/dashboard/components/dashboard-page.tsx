"use client";

import {
	Audit01Icon,
	Calendar01Icon,
	LockSync01Icon,
	Shield01Icon,
	Tick02Icon,
	UserCircleIcon,
	UserEdit01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/use-auth";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const roleColors: Record<string, string> = {
	SUPER_ADMIN: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
	ADMIN: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
	MANAGER: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
	USER: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
};

function getSecurityScore(user: User): number {
	let score = 0;
	if (user.is2faEnabled) score += 50;
	if (user.hasPassword) score += 30;
	if (user.emailVerified) score += 20;
	return score;
}

function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
}

// Simple device icon as SVG since hugeicons doesn't have a devices icon we can use
function DevicesIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="2" y="3" width="20" height="14" rx="2" />
			<path d="M8 21h8" />
			<path d="M12 17v4" />
		</svg>
	);
}

export function DashboardPage() {
	const { user } = useAuth();
	const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
	const { activeSessionCount, recentAuditCount, isLoading } = useDashboardStats(
		Boolean(user) && isAdmin
	);

	if (!user) {
		return (
			<>
				<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</>
		);
	}

	const securityScore = getSecurityScore(user);

	return (
		<>
			<SetBreadcrumb items={[{ name: "Dashboard", isCurrent: true }]} />
			<div className="flex flex-col gap-6">
				{/* Welcome Header */}
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-normal">
							Welcome back, {user.name || "User"}!
						</h1>
						<p className="text-muted-foreground text-sm">
							Here&apos;s an overview of your account and security status.
						</p>
					</div>
					<Badge className={roleColors[user.role] ?? roleColors.USER}>
						{user.role.replace("_", " ")}
					</Badge>
				</div>

				{/* Status Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{/* Account Status Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2">
								<HugeiconsIcon icon={UserCircleIcon} className="text-primary size-5" />
								Account Status
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Approval</span>
								<Badge variant={user.isApproved ? "default" : "destructive"}>
									{user.isApproved ? "Approved" : "Pending"}
								</Badge>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">Email</span>
								<Badge variant={user.emailVerified ? "default" : "outline"}>
									{user.emailVerified ? "Verified" : "Unverified"}
								</Badge>
							</div>
							<Separator />
							<div className="text-muted-foreground flex items-center gap-2 text-xs">
								<HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
								Member since {formatDate(user.createdAt)}
							</div>
						</CardContent>
					</Card>

					{/* Security Score Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2">
								<HugeiconsIcon icon={Shield01Icon} className="text-primary size-5" />
								Security Score
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<Progress value={securityScore} className="flex-1" />
								<span className="text-lg font-semibold tabular-nums">{securityScore}%</span>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2 text-sm">
									<HugeiconsIcon
										icon={user.is2faEnabled ? Tick02Icon : Shield01Icon}
										className={user.is2faEnabled ? "text-green-500" : "text-muted-foreground"}
										size={16}
									/>
									<span className={user.is2faEnabled ? "text-foreground" : "text-muted-foreground"}>
										Two-factor authentication
									</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<HugeiconsIcon
										icon={user.hasPassword ? Tick02Icon : LockSync01Icon}
										className={user.hasPassword ? "text-green-500" : "text-muted-foreground"}
										size={16}
									/>
									<span className={user.hasPassword ? "text-foreground" : "text-muted-foreground"}>
										Password set
									</span>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Sessions Card */}
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="flex items-center gap-2">
								<DevicesIcon className="text-primary size-5" />
								Active Sessions
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-bold">
									{isLoading ? "..." : (activeSessionCount ?? "—")}
								</span>
								<span className="text-muted-foreground text-sm">
									{activeSessionCount === 1 ? "session" : "sessions"}
								</span>
							</div>
							<Button variant="outline" size="sm" className="w-fit" asChild>
								<Link href={route.private.sessions}>Manage sessions</Link>
							</Button>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<div>
					<h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Button variant="outline" className="h-auto flex-col items-start gap-3 p-4" asChild>
							<Link href={route.private.profile}>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-lg p-2">
										<HugeiconsIcon icon={UserEdit01Icon} className="text-primary size-5" />
									</div>
									<div className="text-left">
										<div className="font-medium">Update Profile</div>
										<div className="text-muted-foreground text-xs">
											Edit your personal information
										</div>
									</div>
								</div>
							</Link>
						</Button>

						<Button variant="outline" className="h-auto flex-col items-start gap-3 p-4" asChild>
							<Link href={route.private.profile}>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-lg p-2">
										<HugeiconsIcon icon={LockSync01Icon} className="text-primary size-5" />
									</div>
									<div className="text-left">
										<div className="font-medium">Security Settings</div>
										<div className="text-muted-foreground text-xs">Manage 2FA and password</div>
									</div>
								</div>
							</Link>
						</Button>

						<Button variant="outline" className="h-auto flex-col items-start gap-3 p-4" asChild>
							<Link href={route.private.sessions}>
								<div className="flex items-center gap-3">
									<div className="bg-primary/10 rounded-lg p-2">
										<DevicesIcon className="text-primary size-5" />
									</div>
									<div className="text-left">
										<div className="font-medium">View Sessions</div>
										<div className="text-muted-foreground text-xs">Manage active devices</div>
									</div>
								</div>
							</Link>
						</Button>

						{isAdmin && (
							<Button variant="outline" className="h-auto flex-col items-start gap-3 p-4" asChild>
								<Link href={route.private.auditLogs}>
									<div className="flex items-center gap-3">
										<div className="bg-primary/10 rounded-lg p-2">
											<HugeiconsIcon icon={Audit01Icon} className="text-primary size-5" />
										</div>
										<div className="text-left">
											<div className="font-medium">Audit Logs</div>
											<div className="text-muted-foreground text-xs">
												{recentAuditCount !== null
													? `${recentAuditCount} recent events`
													: "View security events"}
											</div>
										</div>
									</div>
								</Link>
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
