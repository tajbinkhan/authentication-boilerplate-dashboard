"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
	return useSyncExternalStore(
		callback => {
			if (typeof window === "undefined") {
				return () => undefined;
			}

			const mediaQueryList = window.matchMedia(query);
			mediaQueryList.addEventListener("change", callback);

			return () => {
				mediaQueryList.removeEventListener("change", callback);
			};
		},
		() => {
			if (typeof window === "undefined") {
				return false;
			}

			return window.matchMedia(query).matches;
		},
		() => false
	);
}
