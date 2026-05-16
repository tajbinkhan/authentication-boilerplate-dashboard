import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

type SpinnerProps = Omit<SVGProps<SVGSVGElement>, "strokeWidth"> & {
	strokeWidth?: number;
};

function Spinner({ className, strokeWidth = 2, ...props }: SpinnerProps) {
	return (
		<HugeiconsIcon
			icon={Loading03Icon}
			strokeWidth={strokeWidth}
			role="status"
			aria-label="Loading"
			className={cn("size-4 animate-spin", className)}
			{...props}
		/>
	);
}

export { Spinner };
