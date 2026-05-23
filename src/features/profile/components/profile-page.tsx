"use client";

import { TwoFactorSecurityCard } from "@/features/auth/two-factor/components/two-factor-security-card";
import { PasswordCard } from "@/features/profile/components/password-card";
import { ProfileUpdateCard } from "@/features/profile/components/profile-update-card";
import { SetBreadcrumb } from "@/providers/breadcrumb-provider";
import { route } from "@/routes/routes";

const breadcrumbItems = [
	{ name: "Dashboard", href: route.private.dashboard },
	{ name: "Profile", isCurrent: true }
];

export default function ProfilePage() {
	return (
		<>
			<SetBreadcrumb items={breadcrumbItems} />
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-2xl font-semibold tracking-normal">Profile</h1>
					<p className="text-muted-foreground text-sm">
						Manage your account profile and security settings.
					</p>
				</div>
				<div className="grid gap-6 xl:grid-cols-2">
					<ProfileUpdateCard />
					<TwoFactorSecurityCard />
					<PasswordCard />
				</div>
			</div>
		</>
	);
}
