import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	logging: {
		browserToTerminal: false,
		serverFunctions: false
	},
	devIndicators: false
};

export default nextConfig;
