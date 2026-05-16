"use client";

import { useQueryState } from "nuqs";
import { createContext } from "react";

interface RedirectContextType {
	redirectUrl: string | null;
	getRedirectUrl: (baseUrl: string) => string;
}

export const RedirectContext = createContext<RedirectContextType | undefined>(undefined);

export function RedirectProvider({ children }: { children: React.ReactNode }) {
	const [redirectUrl] = useQueryState("redirect", {
		parse: v => v ?? null
	});

	const getRedirectUrl = (baseUrl: string): string => {
		if (!redirectUrl) return baseUrl;

		const separator = baseUrl.includes("?") ? "&" : "?";
		return `${baseUrl}${separator}redirect=${encodeURIComponent(redirectUrl)}`;
	};

	return (
		<RedirectContext.Provider value={{ redirectUrl, getRedirectUrl }}>
			{children}
		</RedirectContext.Provider>
	);
}
