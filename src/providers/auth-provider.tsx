"use client";

import { usePathname } from "next/navigation";
import { createContext, useEffect, useState } from "react";

import { route } from "@/routes/routes";
import { getUserFromRequestHeaders } from "@/server/fetch-auth";

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
	const pathname = usePathname();
	const [updatedUser, setUpdatedUser] = useState<User | null>(user);
	const [isLoading, setIsLoading] = useState(!user);

	useEffect(() => {
		const isPrivateRoute =
			route.private &&
			Object.values(route.private).some(routePath => pathname.startsWith(routePath));

		if (isPrivateRoute && !user) {
			getUserFromRequestHeaders()
				.then(fetchedUser => {
					setUpdatedUser(fetchedUser);
				})
				.catch(() => {
					setUpdatedUser(null);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [pathname, user]);

	return (
		<AuthContext.Provider
			value={{
				user: updatedUser,
				isAuthenticated: Boolean(updatedUser),
				isLoading,
				setUser: setUpdatedUser
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
