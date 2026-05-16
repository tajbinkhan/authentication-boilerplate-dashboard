"use client";

import React, { type ReactNode, createContext, useState } from "react";

import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { route } from "@/routes/routes";

export interface BreadcrumbItem {
	name: string;
	href?: string; // Optional URL - if not provided, item is not clickable
	isCurrent?: boolean; // Whether this is the current page
}

interface BreadcrumbContextType {
	breadcrumbs: BreadcrumbItem[];
	setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
	const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
		{ name: "Dashboard", href: route.private.dashboard }
	]);

	return (
		<BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
			{children}
		</BreadcrumbContext.Provider>
	);
}

/**
 * Helper component to set breadcrumbs within a page component
 */
export function SetBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
	const { setBreadcrumbs } = useBreadcrumb();

	// Update breadcrumbs when the component mounts
	React.useEffect(() => {
		setBreadcrumbs(items);

		// Clean up if needed
		return () => {
			// Optional: Reset to default when unmounting
			setBreadcrumbs([{ name: "Dashboard", href: route.private.dashboard }]);
		};
	}, [items, setBreadcrumbs]);

	// This component doesn't render anything
	return null;
}
