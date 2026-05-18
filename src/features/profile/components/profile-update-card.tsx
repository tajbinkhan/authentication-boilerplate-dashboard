"use client";

import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";

import { ProfileUpdateForm } from "@/features/profile/components/profile-update-form";
import useAuth from "@/hooks/use-auth";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ACCEPTED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_AVATAR_EXTENSIONS = ".png,.jpg,.jpeg,.webp";

export function ProfileUpdateCard() {
	const router = useRouter();
	const { user, setUser } = useAuth();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile details</CardTitle>
				<CardDescription>Update your personal information and account image.</CardDescription>
				<CardAction>
					<span className="text-muted-foreground text-sm">
						{user ? "Signed in" : "Unavailable"}
					</span>
				</CardAction>
			</CardHeader>
			<CardContent>
				{!user ? (
					<Alert variant="destructive">
						<AlertTitle>Profile unavailable</AlertTitle>
						<AlertDescription>Please sign in again to update your profile.</AlertDescription>
					</Alert>
				) : (
					<ProfileUpdateForm key={user.id} user={user} setUser={setUser} router={router} />
				)}
			</CardContent>
		</Card>
	);
}

