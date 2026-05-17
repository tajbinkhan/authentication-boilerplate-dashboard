import { ComputerProtectionIcon, LaptopIcon, SmartPhone01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { format } from "date-fns";

export function getSessionDeviceIcon(deviceType: string): IconSvgElement {
	const normalizedDeviceType = deviceType.toLowerCase();

	if (normalizedDeviceType.includes("mobile") || normalizedDeviceType.includes("phone")) {
		return SmartPhone01Icon;
	}

	if (normalizedDeviceType.includes("desktop") || normalizedDeviceType.includes("laptop")) {
		return LaptopIcon;
	}

	return ComputerProtectionIcon;
}

export function formatSessionDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatRevokedCount(count: number): string {
	if (count === 0) {
		return "No other active sessions to revoke";
	}

	if (count === 1) {
		return "1 other session revoked";
	}

	return `${count} other sessions revoked`;
}
