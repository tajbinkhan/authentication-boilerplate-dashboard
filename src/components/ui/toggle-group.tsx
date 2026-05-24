"use client";

import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function ToggleGroup({
	className,
	variant = "default",
	size = "default",
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & {
	variant?: "default" | "outline";
	size?: "default" | "sm" | "lg";
}) {
	return (
		<ToggleGroupPrimitive.Root
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			className={cn(
				"group/toggle-group inline-flex w-fit items-center justify-center gap-1 rounded-4xl p-1",
				"data-variant=default:bg-muted",
				"data-variant=outline:bg-transparent",
				className
			)}
			{...props}
		/>
	);
}

function ToggleGroupItem({
	className,
	variant = "default",
	size = "default",
	...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> & {
	variant?: "default" | "outline";
	size?: "default" | "sm" | "lg";
}) {
	return (
		<ToggleGroupPrimitive.Item
			data-slot="toggle-group-item"
			data-variant={variant}
			data-size={size}
			className={cn(
				"inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
				"text-muted-foreground hover:text-foreground",
				"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
				"data-state=on:bg-background data-state=on:text-foreground data-state=on:shadow-sm",
				"data-variant=outline:data-state=on:border-input data-variant=outline:data-state=on:bg-input/30",
				"disabled:pointer-events-none disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				"data-size=sm:px-2.5 data-size=sm:py-1 data-size=sm:text-xs",
				"data-size=lg:px-4 data-size=lg:py-2 data-size=lg:text-base",
				className
			)}
			{...props}
		/>
	);
}

export { ToggleGroup, ToggleGroupItem };
