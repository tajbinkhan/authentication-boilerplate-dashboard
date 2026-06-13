"use client";

import { createContext, useMemo, useState } from "react";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: React.ReactNode;
	user: User | null;
}

export default function AuthProvider({ children, user }: Readonly<AuthProviderProps>) {
	const [localUser, setLocalUser] = useState<User | null | undefined>(undefined);
	const currentUser = localUser === undefined ? user : localUser;

	const value = useMemo(
		() => ({
			user: currentUser,
			isAuthenticated: Boolean(currentUser),
			isLoading: false,
			setUser: setLocalUser
		}),
		[currentUser]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
