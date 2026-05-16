"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

interface GoogleOAuthProviderProps {
	children: React.ReactNode;
}

export function AppGoogleOAuthProvider({ children }: Readonly<GoogleOAuthProviderProps>) {
	return (
		<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
			{children}
		</GoogleOAuthProvider>
	);
}
