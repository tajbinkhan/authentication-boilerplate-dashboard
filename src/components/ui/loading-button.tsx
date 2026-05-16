import type { VariantProps } from "class-variance-authority";
import React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface LoadingButtonProps
	extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	isLoading: boolean;
	loadingText: string;
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	asChild?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
	isLoading,
	children,
	loadingText,
	disabled = isLoading,
	className,
	...props
}) => {
	return (
		<Button type="submit" className={className} disabled={disabled} {...props}>
			{isLoading ? (
				<>
					<Spinner />
					{loadingText}
				</>
			) : (
				children
			)}
		</Button>
	);
};

export { LoadingButton };
