import { format } from "date-fns";

import type { ManagedUser, UserRole } from "@/features/users/types/users.types";

const manageableByAdmin = new Set<UserRole>(["USER", "MANAGER"]);

export function formatUserDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatUserRole(role: UserRole): string {
	return role
		.toLowerCase()
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function canManageUser(currentUser: User | null | undefined, target: ManagedUser): boolean {
	if (!currentUser || currentUser.id === target.id) return false;
	if (currentUser.role === "SUPER_ADMIN") return true;
	return currentUser.role === "ADMIN" && manageableByAdmin.has(target.role);
}

export function getAssignableRoles(currentUser: User | null | undefined): UserRole[] {
	if (!currentUser) return [];
	if (currentUser.role === "SUPER_ADMIN") return ["SUPER_ADMIN", "ADMIN", "MANAGER", "USER"];
	if (currentUser.role === "ADMIN") return ["MANAGER", "USER"];
	return [];
}

export function getDefaultAssignableRole(currentUser: User | null | undefined): UserRole {
	const assignableRoles = getAssignableRoles(currentUser);
	return assignableRoles.includes("USER") ? "USER" : (assignableRoles[0] ?? "USER");
}

export function formatRevokedUserSessionsCount(count: number): string {
	if (count === 0) {
		return "No active sessions to revoke";
	}

	if (count === 1) {
		return "1 session revoked";
	}

	return `${count} sessions revoked`;
}
