"use client";

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
import { SyntheticEvent } from "react";

export interface CodeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	code: string;
	onCodeChange: (code: string) => void;
	onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
	isPending: boolean;
	actionLabel: string;
	variant?: "default" | "destructive";
}

export function CodeDialog({
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
						<div className="text-muted-foreground text-sm">{description}</div>
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
