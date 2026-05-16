import { useContext } from "react";

import { BreadcrumbContext } from "@/providers/breadcrumb-provider";

export function useBreadcrumb() {
	const context = useContext(BreadcrumbContext);
	if (context === undefined) {
		throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
	}
	return context;
}
