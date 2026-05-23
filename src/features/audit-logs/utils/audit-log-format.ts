import { format } from "date-fns";

import type { AuditLog } from "@/features/audit-logs/types/audit-logs.types";
import { formatUserRole } from "@/features/users/utils/user-format";

const actionLabels: Record<string, string> = {
	USER_CREATED: "User created",
	USER_PROVISIONED: "User provisioned",
	USER_UPDATED: "User updated",
	ROLE_UPDATED: "Role updated",
	USER_DELETED: "User deleted",
	USER_SESSIONS_REVOKED: "Sessions revoked",
	"2FA_ENABLED": "2FA enabled",
	"2FA_DISABLED": "2FA disabled",
	"2FA_RESET": "2FA reset",
	LOGIN_SUCCESS: "Login success"
};

export function formatAuditAction(action: string): string {
	return actionLabels[action] ?? titleize(action);
}

export function formatAuditTargetType(targetType: string): string {
	return titleize(targetType);
}

export function formatAuditDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatAuditActor(log: AuditLog): string {
	if (!log.actorId && !log.actorRole && !log.actorName && !log.actorEmail) {
		return "System";
	}

	if (log.actorName) {
		return log.actorEmail
			? `${log.actorName} (${log.actorEmail})`
			: log.actorName;
	}

	if (log.actorEmail) {
		return log.actorEmail;
	}

	if (log.actorRole) {
		return log.actorId
			? `${formatUserRole(log.actorRole)} ${formatShortId(log.actorId)}`
			: formatUserRole(log.actorRole);
	}

	return log.actorId ? formatShortId(log.actorId) : "Unknown";
}

export function formatShortId(id: string | null | undefined): string {
	if (!id) return "None";
	if (id.length <= 14) return id;

	return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

export function formatAuditMetadataSummary(log: AuditLog): string {
	const metadata = getRecord(log.metadata);

	switch (log.action) {
		case "USER_CREATED": {
			const email = getString(metadata.email);
			const role = getString(metadata.role);
			const approved = getBoolean(metadata.isApproved);
			const status = approved === undefined ? "" : approved ? ", approved" : ", pending";
			return `${email ?? "User"}${role ? ` as ${titleize(role)}` : ""}${status}`;
		}
		case "USER_PROVISIONED": {
			const provider = getString(metadata.provider);
			const email = getString(metadata.email);
			return `${titleize(provider ?? "provider")} provisioning${email ? ` for ${email}` : ""}`;
		}
		case "USER_UPDATED": {
			const changes = getRecord(metadata.changes);
			const fields = Object.keys(changes);
			if (fields.length === 0) return "No field changes recorded";
			if (fields.length <= 3) return `Changed ${fields.map(titleize).join(", ")}`;
			return `Changed ${fields.length} fields`;
		}
		case "ROLE_UPDATED": {
			const from = getString(metadata.from);
			const to = getString(metadata.to);
			const changed = getBoolean(metadata.changed);
			if (from && to) {
				return changed === false
					? `Role already ${titleize(to)}`
					: `${titleize(from)} to ${titleize(to)}`;
			}
			return "Role change recorded";
		}
		case "USER_DELETED": {
			const email = getString(metadata.email);
			const role = getString(metadata.role);
			return `${email ?? "User"}${role ? ` (${titleize(role)})` : ""}`;
		}
		case "USER_SESSIONS_REVOKED": {
			const revokedCount = getNumber(metadata.revokedCount);
			return formatCount(revokedCount, "session", "sessions", "No sessions revoked");
		}
		case "2FA_ENABLED": {
			const recoveryCodeCount = getNumber(metadata.recoveryCodeCount);
			return formatCount(recoveryCodeCount, "recovery code", "recovery codes", "Enabled");
		}
		case "2FA_DISABLED": {
			const revokedOtherSessionCount = getNumber(metadata.revokedOtherSessionCount);
			return formatCount(
				revokedOtherSessionCount,
				"other session revoked",
				"other sessions revoked",
				"Disabled"
			);
		}
		case "2FA_RESET": {
			const revokedCount = getNumber(metadata.revokedCount);
			const wasEnabled = getBoolean(metadata.wasEnabled);
			if (revokedCount !== undefined) {
				return `${formatCount(revokedCount, "session revoked", "sessions revoked", "No sessions revoked")}${wasEnabled === false ? ", was off" : ""}`;
			}
			return wasEnabled === false ? "Reset while off" : "Reset";
		}
		case "LOGIN_SUCCESS": {
			const method = getString(metadata.method);
			const deviceName = getString(metadata.deviceName);
			const deviceType = getString(metadata.deviceType);
			const device = deviceName ?? deviceType;
			return `${titleize(method ?? "login")}${device ? ` on ${device}` : ""}`;
		}
		default:
			return Object.keys(metadata).length ? "Metadata available" : "No metadata";
	}
}

export function formatMetadataJson(metadata: Record<string, unknown>): string {
	try {
		return JSON.stringify(metadata ?? {}, null, 2);
	} catch {
		return "{}";
	}
}

export function isSystemAuditLog(log: AuditLog): boolean {
	return !log.actorId && !log.actorRole;
}

function formatCount(
	value: number | undefined,
	singular: string,
	plural: string,
	empty: string
): string {
	if (value === undefined) return empty;
	if (value === 0) return empty;
	if (value === 1) return `1 ${singular}`;
	return `${value} ${plural}`;
}

function getRecord(value: unknown): Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
}

function getString(value: unknown): string | undefined {
	return typeof value === "string" && value.trim() ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
	return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getBoolean(value: unknown): boolean | undefined {
	return typeof value === "boolean" ? value : undefined;
}

function titleize(value: string): string {
	return value
		.replace(/[_-]+/g, " ")
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
