"use client";

import {
	CheckCircle,
	ShieldKeyIcon,
	UserAdd01Icon,
	UserGroupIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { AccessModel } from "@/features/system/types/system.types";
import { cn } from "@/lib/utils";

const ACCESS_MODELS: {
	id: AccessModel;
	title: string;
	description: string;
	icon: typeof UserAdd01Icon;
	badgeLabel: string;
	badgeClass: string;
}[] = [
	{
		id: "OPEN",
		title: "Open Registration",
		description: "Anyone can sign up and gain immediate access.",
		icon: UserAdd01Icon,
		badgeLabel: "Open",
		badgeClass: "bg-emerald/10 text-emerald dark:bg-emerald/20"
	},
	{
		id: "APPROVAL_BASED",
		title: "Approval-Required",
		description: "Users can register, but an admin must approve their account first.",
		icon: UserGroupIcon,
		badgeLabel: "Moderated",
		badgeClass: "bg-amber/10 text-amber dark:bg-amber/20"
	},
	{
		id: "CLOSED",
		title: "Closed / Invite-Only",
		description: "Self-registration is disabled. Only pre-created accounts can sign in.",
		icon: ShieldKeyIcon,
		badgeLabel: "Restricted",
		badgeClass: "bg-rose/10 text-rose dark:bg-rose/20"
	}
];

interface AccessModelCardProps {
	value: AccessModel;
	onChange: (model: AccessModel) => void;
}

export function AccessModelCard({ value, onChange }: AccessModelCardProps) {
	return (
		<Card className="border-border/50 pt-0 shadow-sm">
			<CardHeader className="border-border/10 bg-muted/20 border-b pt-6">
				<CardTitle className="text-base font-semibold">Access Model</CardTitle>
				<CardDescription>
					Control how new users register and sign in to the application.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-6">
				<ToggleGroup
					type="single"
					value={value}
					onValueChange={val => {
						if (val) onChange(val as AccessModel);
					}}
					className="w-full flex-col items-stretch gap-3 rounded-none bg-transparent p-0"
				>
					{ACCESS_MODELS.map(model => {
						const Icon = model.icon;
						const isSelected = value === model.id;

						return (
							<ToggleGroupItem
								key={model.id}
								value={model.id}
								className={cn(
									"flex w-full flex-col items-start gap-2 rounded-xl border p-4 text-left",
									"data-state=on:border-l-4 data-state=on:border-l-primary data-state=on:bg-primary/10 data-state=on:shadow-sm",
									"border-border/50 hover:bg-muted/10"
								)}
							>
								<div className="flex w-full items-center gap-3">
									<div
										className={cn(
											"flex size-9 shrink-0 items-center justify-center rounded-lg",
											isSelected
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground"
										)}
									>
										<HugeiconsIcon icon={Icon} />
									</div>
									<div className="flex w-full items-center justify-between gap-2">
										<div>
											<span className="text-sm font-semibold">{model.title}</span>
											<p className="text-muted-foreground text-xs leading-relaxed text-wrap">
												{model.description}
											</p>
										</div>
										{isSelected && (
											<Badge variant="default" className={cn("border-0", model.badgeClass)}>
												<HugeiconsIcon icon={CheckCircle} data-icon="inline-start" />
												{model.badgeLabel}
											</Badge>
										)}
									</div>
								</div>
							</ToggleGroupItem>
						);
					})}
				</ToggleGroup>
			</CardContent>
		</Card>
	);
}

