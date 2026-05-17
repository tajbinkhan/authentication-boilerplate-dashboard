"use client";

import { ComputerRemoveIcon, ShieldBanIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRevokeSessionMutation } from "@/features/sessions/actions/sessions.mutations";
import type { Session } from "@/features/sessions/types/sessions.types";
import { ApiError } from "@/lib/api/errors";
import { route } from "@/routes/routes";

interface SessionDataTableRowActionsProps {
	session: Session;
}

export function SessionDataTableRowActions({ session }: SessionDataTableRowActionsProps) {
	const router = useRouter();
	const revokeSessionMutation = useRevokeSessionMutation();

	const handleRevokeSession = () => {
		revokeSessionMutation.mutate(session.id, {
			onSuccess: revokedSession => {
				if (revokedSession.isCurrent) {
					toast.success("Session revoked. Please sign in again.");
					router.replace(route.protected.login);
					return;
				}

				toast.success("Session revoked successfully");
			},
			onError: error => {
				handleRequestError(error, router, "Failed to revoke session");
			}
		});
	};

	if (session.status !== "active") {
		return <span className="text-muted-foreground text-sm">No action</span>;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" size="sm" disabled={revokeSessionMutation.isPending}>
					<HugeiconsIcon icon={ComputerRemoveIcon} data-icon="inline-start" />
					{revokeSessionMutation.isPending ? "Revoking" : "Revoke"}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia>
						<HugeiconsIcon icon={ShieldBanIcon} />
					</AlertDialogMedia>
					<AlertDialogTitle>
						{session.isCurrent ? "Revoke your current session?" : "Revoke this session?"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{session.isCurrent
							? "This will sign you out on this device and send you back to login."
							: `This will sign out ${session.deviceName} from your account.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction variant="destructive" onClick={handleRevokeSession}>
						Revoke session
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function handleRequestError(
	error: unknown,
	router: ReturnType<typeof useRouter>,
	fallback: string
) {
	if (error instanceof ApiError && error.statusCode === 401) {
		toast.error("Please sign in again");
		router.replace(route.protected.login);
		return;
	}

	toast.error(error instanceof ApiError ? error.message : fallback);
}
