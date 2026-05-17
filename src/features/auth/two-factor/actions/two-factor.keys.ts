export const twoFactorKeys = {
	all: ["two-factor"] as const,
	status: () => [...twoFactorKeys.all, "status"] as const
};
