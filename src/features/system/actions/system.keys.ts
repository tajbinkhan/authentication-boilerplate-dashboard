export const systemKeys = {
	all: ["system"] as const,
	settings: () => [...systemKeys.all, "settings"] as const,
	publicSettings: () => [...systemKeys.all, "public-settings"] as const
};
