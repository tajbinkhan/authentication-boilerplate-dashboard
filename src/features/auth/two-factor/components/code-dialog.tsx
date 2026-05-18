"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	twoFactorCodeFormSchema,
	type TwoFactorCodeFormValues
} from "@/features/auth/two-factor/schemas/two-factor.schema";

export interface CodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onSubmit: (values: TwoFactorCodeFormValues) => void;
	isPending: boolean;
	actionLabel: string;
	variant?: "default" | "destructive";
}

export function CodeDialog({
	open,
	onOpenChange,
	title,
	description,
	onSubmit,
	isPending,
	actionLabel,
	variant = "default"
}: CodeDialogProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<TwoFactorCodeFormValues>({
		resolver: zodResolver(twoFactorCodeFormSchema),
		defaultValues: { code: "" }
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			reset();
		}

		onOpenChange(nextOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<div className="text-muted-foreground text-sm">{description}</div>
					</DialogHeader>
					<Field>
						<FieldLabel htmlFor={`${actionLabel}-code`}>Code</FieldLabel>
						<Input
							id={`${actionLabel}-code`}
							{...register("code")}
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
						<Button type="submit" variant={variant} disabled={isPending}>
							{isPending ? "Working" : actionLabel}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
