"use client";

import { Copy01Icon, Loading03Icon, LockKeyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	useConfirmTwoFactorSetupMutation,
	useDisableTwoFactorMutation,
	useRegenerateTwoFactorRecoveryCodesMutation,
	useStartTwoFactorSetupMutation
} from "@/features/auth/two-factor/actions/two-factor.mutations";
import { useTwoFactorStatusQuery } from "@/features/auth/two-factor/actions/two-factor.queries";
import type { TwoFactorSetupStart } from "@/features/auth/two-factor/types/two-factor.types";

export function TwoFactorSecurityCard() {
	const statusQuery = useTwoFactorStatusQuery();
	const startSetupMutation = useStartTwoFactorSetupMutation();
	const confirmSetupMutation = useConfirmTwoFactorSetupMutation();
	const disableMutation = useDisableTwoFactorMutation();
	const regenerateMutation = useRegenerateTwoFactorRecoveryCodesMutation();

	const [setupOpen, setSetupOpen] = useState(false);
	const [setup, setSetup] = useState<TwoFactorSetupStart | null>(null);
	const [setupCode, setSetupCode] = useState("");
	const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
	const [disableOpen, setDisableOpen] = useState(false);
	const [disableCode, setDisableCode] = useState("");
	const [regenerateOpen, setRegenerateOpen] = useState(false);
	const [regenerateCode, setRegenerateCode] = useState("");
	const [recoveryOpen, setRecoveryOpen] = useState(false);

	const enabled = Boolean(statusQuery.data?.enabled);

	const handleStartSetup = () => {
		startSetupMutation.mutate(undefined, {
			onSuccess: result => {
				setSetup(result);
				setSetupCode("");
				setRecoveryCodes(null);
				setSetupOpen(true);
			},
			onError: error => toast.error(getErrorMessage(error, "Failed to start 2FA setup"))
		});
	};

	const handleConfirmSetup = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		confirmSetupMutation.mutate(
			{ code: setupCode },
			{
				onSuccess: result => {
					setRecoveryCodes(result.recoveryCodes);
					toast.success("Two-factor authentication enabled");
				},
				onError: error => toast.error(getErrorMessage(error, "Failed to confirm 2FA setup"))
			}
		);
	};

	const handleDisable = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		disableMutation.mutate(
			{ code: disableCode },
			{
				onSuccess: () => {
					toast.success("Two-factor authentication disabled");
					setDisableCode("");
					setDisableOpen(false);
				},
				onError: error => toast.error(getErrorMessage(error, "Failed to disable 2FA"))
			}
		);
	};

	const handleRegenerate = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		regenerateMutation.mutate(
			{ code: regenerateCode },
			{
				onSuccess: result => {
					setRecoveryCodes(result.recoveryCodes);
					setRegenerateCode("");
					setRegenerateOpen(false);
					setRecoveryOpen(true);
					toast.success("Recovery codes regenerated");
				},
				onError: error =>
					toast.error(getErrorMessage(error, "Failed to regenerate recovery codes"))
			}
		);
	};

	const handleCopyRecoveryCodes = async () => {
		if (!recoveryCodes?.length) return;

		await navigator.clipboard.writeText(recoveryCodes.join("\n"));
		toast.success("Recovery codes copied");
	};

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Two-factor authentication</CardTitle>
					<CardDescription>
						Protect your account with an authenticator app and recovery codes.
					</CardDescription>
					<CardAction>
						<span className="text-muted-foreground text-sm">
							{statusQuery.isLoading ? "Checking" : enabled ? "Enabled" : "Off"}
						</span>
					</CardAction>
				</CardHeader>
				<CardContent className="space-y-4">
					{statusQuery.error ? (
						<Alert variant="destructive">
							<AlertTitle>Could not load 2FA status</AlertTitle>
							<AlertDescription>{statusQuery.error.message}</AlertDescription>
						</Alert>
					) : null}

					<div className="flex flex-col gap-3 sm:flex-row">
						{enabled ? (
							<>
								<Button type="button" variant="outline" onClick={() => setRegenerateOpen(true)}>
									Regenerate recovery codes
								</Button>
								<Button type="button" variant="destructive" onClick={() => setDisableOpen(true)}>
									Disable 2FA
								</Button>
							</>
						) : (
							<Button
								type="button"
								onClick={handleStartSetup}
								disabled={startSetupMutation.isPending || statusQuery.isLoading}
							>
								{startSetupMutation.isPending ? (
									<HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin" />
								) : (
									<HugeiconsIcon icon={LockKeyIcon} data-icon="inline-start" />
								)}
								Set up 2FA
							</Button>
						)}
					</div>

					{enabled ? (
						<p className="text-muted-foreground text-sm">
							You have {statusQuery.data?.recoveryCodeCount ?? 0} unused recovery codes.
						</p>
					) : null}
				</CardContent>
			</Card>

			<Dialog open={setupOpen} onOpenChange={setSetupOpen}>
				<DialogContent className="sm:max-w-xl" showCloseButton={!recoveryCodes?.length}>
					{recoveryCodes?.length ? (
						<RecoveryCodesContent
							recoveryCodes={recoveryCodes}
							onCopy={handleCopyRecoveryCodes}
							onDone={() => {
								setSetupOpen(false);
								setRecoveryCodes(null);
							}}
						/>
					) : (
						<form onSubmit={handleConfirmSetup} className="grid gap-6">
							<DialogHeader>
								<DialogTitle>Set up two-factor authentication</DialogTitle>
								<DialogDescription>
									Scan the QR code with your authenticator app, then enter the code.
								</DialogDescription>
							</DialogHeader>
							{setup ? (
								<div className="grid gap-4">
									<Image
										src={setup.qrCodeDataUrl}
										alt="Two-factor setup QR code"
										width={192}
										height={192}
										unoptimized
										className="mx-auto size-48 rounded-lg border bg-white p-2"
									/>
									<Field>
										<FieldLabel>Manual entry key</FieldLabel>
										<div className="bg-muted text-foreground rounded-lg px-3 py-2 font-mono text-sm break-all">
											{setup.manualEntryKey}
										</div>
										<FieldDescription>
											This setup expires at {new Date(setup.expiresAt).toLocaleTimeString()}.
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor="two-factor-setup-code">Authenticator code</FieldLabel>
										<Input
											id="two-factor-setup-code"
											value={setupCode}
											onChange={event => setSetupCode(event.target.value)}
											autoComplete="one-time-code"
											placeholder="123456"
											disabled={confirmSetupMutation.isPending}
										/>
									</Field>
								</div>
							) : null}
							<DialogFooter>
								<DialogClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</DialogClose>
								<Button
									type="submit"
									disabled={!setupCode.trim() || confirmSetupMutation.isPending}
								>
									{confirmSetupMutation.isPending ? "Confirming" : "Enable 2FA"}
								</Button>
							</DialogFooter>
						</form>
					)}
				</DialogContent>
			</Dialog>

			<CodeDialog
				open={disableOpen}
				onOpenChange={setDisableOpen}
				title="Disable two-factor authentication"
				description="Enter a current authenticator or recovery code."
				code={disableCode}
				onCodeChange={setDisableCode}
				onSubmit={handleDisable}
				isPending={disableMutation.isPending}
				actionLabel="Disable 2FA"
				variant="destructive"
			/>

			<CodeDialog
				open={regenerateOpen}
				onOpenChange={setRegenerateOpen}
				title="Regenerate recovery codes"
				description="Your old recovery codes will stop working after this succeeds."
				code={regenerateCode}
				onCodeChange={setRegenerateCode}
				onSubmit={handleRegenerate}
				isPending={regenerateMutation.isPending}
				actionLabel="Regenerate codes"
			/>

			<Dialog open={recoveryOpen} onOpenChange={setRecoveryOpen}>
				<DialogContent className="sm:max-w-xl" showCloseButton={false}>
					<RecoveryCodesContent
						recoveryCodes={recoveryCodes ?? []}
						onCopy={handleCopyRecoveryCodes}
						onDone={() => {
							setRecoveryOpen(false);
							setRecoveryCodes(null);
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

interface CodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	code: string;
	onCodeChange: (code: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	isPending: boolean;
	actionLabel: string;
	variant?: "default" | "destructive";
}

function CodeDialog({
	open,
	onOpenChange,
	title,
	description,
	code,
	onCodeChange,
	onSubmit,
	isPending,
	actionLabel,
	variant = "default"
}: CodeDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<form onSubmit={onSubmit} className="grid gap-6">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<Field>
						<FieldLabel htmlFor={`${actionLabel}-code`}>Code</FieldLabel>
						<Input
							id={`${actionLabel}-code`}
							value={code}
							onChange={event => onCodeChange(event.target.value)}
							autoComplete="one-time-code"
							placeholder="123456 or ABCDE-F1234"
							disabled={isPending}
						/>
					</Field>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" variant={variant} disabled={!code.trim() || isPending}>
							{isPending ? "Working" : actionLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface RecoveryCodesContentProps {
	recoveryCodes: string[];
	onCopy: () => void;
	onDone: () => void;
}

function RecoveryCodesContent({ recoveryCodes, onCopy, onDone }: RecoveryCodesContentProps) {
	return (
		<div className="grid gap-6">
			<DialogHeader>
				<DialogTitle>Save your recovery codes</DialogTitle>
				<DialogDescription>
					These codes are shown once. Store them somewhere safe before closing.
				</DialogDescription>
			</DialogHeader>
			<div className="grid gap-2 sm:grid-cols-2">
				{recoveryCodes.map(code => (
					<div key={code} className="bg-muted rounded-lg px-3 py-2 font-mono text-sm">
						{code}
					</div>
				))}
			</div>
			<DialogFooter>
				<Button type="button" variant="outline" onClick={onCopy}>
					<HugeiconsIcon icon={Copy01Icon} data-icon="inline-start" />
					Copy codes
				</Button>
				<Button type="button" onClick={onDone}>
					I have saved these codes
				</Button>
			</DialogFooter>
		</div>
	);
}

function getErrorMessage(error: unknown, fallback: string): string {
	return error instanceof Error ? error.message : fallback;
}
