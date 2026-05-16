// Get user initials for avatar fallback
export const getUserInitials = (name?: string | null) => {
	if (!name) return "U";
	return name
		.split(" ")
		.map(n => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
};

export function formatLabel<T extends string>(value: T): string {
	return value
		.toLowerCase()
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
