"use client";

import { createContext, useState } from "react";

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
	const [updatedUser, setUpdatedUser] = useState<User | null>(user);

	return (
		<AuthContext.Provider
			value={{
				user: updatedUser,
				isAuthenticated: Boolean(updatedUser),
				isLoading: false,
				setUser: setUpdatedUser
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
