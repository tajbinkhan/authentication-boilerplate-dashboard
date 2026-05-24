"use client";

import {
	UserAdd01Icon,
	UserGroupIcon,
	ShieldKeyIcon,
	Tick02Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AccessModel } from "@/features/system/types/system.types";

const ACCESS_MODELS = [
	{
		id: "OPEN" as AccessModel,
		title: "Open Registration",
		description: "Anyone can sign up and gain access to the system immediately.",
		icon: UserAdd01Icon,
		gradient: "from-emerald-500/10 to-teal-500/10",
		borderSelected: "border-emerald-500/50 dark:border-emerald-400/50",
		accentColor: "text-emerald-500"
	},
	{
		id: "APPROVAL_BASED" as AccessModel,
		title: "Approval-Based",
		description:
			"Users can register, but an administrator must manually approve their account before they can sign in.",
		icon: UserGroupIcon,
		gradient: "from-amber-500/10 to-orange-500/10",
		borderSelected: "border-amber-500/50 dark:border-amber-400/50",
		accentColor: "text-amber-500"
	},
	{
		id: "CLOSED" as AccessModel,
		title: "Closed / Private",
		description:
			"Self-registration is disabled. Only pre-created accounts can request a login magic link.",
		icon: ShieldKeyIcon,
		gradient: "from-rose-500/10 to-pink-500/10",
		borderSelected: "border-rose-500/50 dark:border-rose-400/50",
		accentColor: "text-rose-500"
	}
];

interface AccessModelCardProps {
	value: AccessModel;
	onChange: (model: AccessModel) => void;
}

export function AccessModelCard({ value, onChange }: AccessModelCardProps) {
	return (
		<Card className="border-border/50 overflow-hidden shadow-sm">
			<CardHeader className="border-border/10 bg-muted/20 border-b">
				<CardTitle className="text-base font-semibold">Access Model</CardTitle>
				<CardDescription>
					Control how new users register and sign in to the application.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4 p-6 sm:grid-cols-3">
				{ACCESS_MODELS.map(model => {
					const isSelected = value === model.id;
					const Icon = model.icon;

					return (
						<button
							key={model.id}
							type="button"
							onClick={() => onChange(model.id)}
							className={cn(
								"relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200 hover:shadow-md focus:outline-none",
								isSelected
									? cn("bg-linear-to-br shadow-inner", model.gradient, model.borderSelected)
									: "border-border/60 hover:border-border"
							)}
						>
							<div className="mb-3 flex w-full items-center justify-between">
								<div
									className={cn(
										"bg-background border-border/20 rounded-xl border p-2 shadow-sm",
										model.accentColor
									)}
								>
									<HugeiconsIcon icon={Icon} className="size-5" />
								</div>
								{isSelected && (
									<div
										className={cn(
											"bg-background flex size-5 items-center justify-center rounded-full border shadow-sm",
											model.accentColor,
											model.borderSelected
										)}
									>
										<HugeiconsIcon icon={Tick02Icon} className="size-3" />
									</div>
								)}
							</div>
							<h3 className="mb-1 text-sm font-semibold">{model.title}</h3>
							<p className="text-muted-foreground text-xs leading-relaxed">
								{model.description}
							</p>
						</button>
					);
				})}
			</CardContent>
		</Card>
	);
}
