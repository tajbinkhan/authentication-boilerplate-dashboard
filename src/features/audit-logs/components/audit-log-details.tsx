"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AuditLog } from "@/features/audit-logs/types/audit-logs.types";
import {
	formatAuditAction,
	formatAuditActor,
	formatAuditDate,
	formatAuditMetadataSummary,
	formatAuditTargetType,
	formatMetadataJson,
	formatShortId,
	isSystemAuditLog
} from "@/features/audit-logs/utils/audit-log-format";
import { formatUserRole } from "@/features/users/utils/user-format";

interface AuditLogDetailsProps {
	log: AuditLog;
}

export function AuditLogDetails({ log }: AuditLogDetailsProps) {
	return (
		<div className="grid gap-5">
			<section className="grid gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<ActionBadge action={log.action} />
					<Badge variant="outline">{formatAuditTargetType(log.targetType)}</Badge>
				</div>
				<p className="text-muted-foreground text-sm">{formatAuditMetadataSummary(log)}</p>
			</section>

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Actor and target</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailItem
						label="Actor name"
						value={isSystemAuditLog(log) ? "System" : (log.actorName ?? formatAuditActor(log))}
					/>
					<DetailItem
						label="Actor email"
						value={isSystemAuditLog(log) ? "System" : (log.actorEmail ?? "Not available")}
					/>
					<DetailItem
						label="Actor role"
						value={log.actorRole ? formatUserRole(log.actorRole) : "System"}
					/>
					<DetailItem label="Actor ID" value={log.actorId ?? "System"} />
					<DetailItem
						label="Target"
						value={`${formatAuditTargetType(log.targetType)} ${formatShortId(log.targetId)}`}
					/>
					<DetailItem label="Target ID" value={log.targetId} />
					<DetailItem label="Audit ID" value={log.id} />
				</div>
			</section>

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Request context</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailItem label="IP address" value={log.ipAddress ?? "Unknown"} />
					<DetailItem label="Created" value={formatAuditDate(log.createdAt)} />
					<DetailItem label="Updated" value={formatAuditDate(log.updatedAt)} />
					<DetailItem
						label="User agent"
						value={log.userAgent ?? "Unknown"}
						className="sm:col-span-2"
					/>
				</div>
			</section>

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Metadata</h3>
				<pre className="bg-muted text-muted-foreground max-h-80 overflow-auto rounded-md p-3 text-xs leading-relaxed whitespace-pre-wrap">
					{formatMetadataJson(log.metadata)}
				</pre>
			</section>
		</div>
	);
}

function DetailItem({
	label,
	value,
	className
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<div className="text-muted-foreground text-xs">{label}</div>
			<div className="text-sm wrap-break-word">{value}</div>
		</div>
	);
}

function ActionBadge({ action }: { action: string }) {
	const variant =
		action === "USER_DELETED" || action === "2FA_RESET"
			? "destructive"
			: action === "USER_CREATED" || action === "LOGIN_SUCCESS"
				? "default"
				: action === "USER_PROVISIONED"
					? "outline"
					: "secondary";

	return <Badge variant={variant}>{formatAuditAction(action)}</Badge>;
}

