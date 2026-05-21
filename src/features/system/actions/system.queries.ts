import { useQuery } from "@tanstack/react-query";
import { getPublicSettings, getSettings } from "./system.actions";
import { systemKeys } from "./system.keys";

export function useSystemSettingsQuery() {
	return useQuery({
		queryKey: systemKeys.settings(),
		queryFn: getSettings
	});
}

export function usePublicSystemSettingsQuery() {
	return useQuery({
		queryKey: systemKeys.publicSettings(),
		queryFn: getPublicSettings
	});
}
