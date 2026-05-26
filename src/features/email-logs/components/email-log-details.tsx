"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { EmailLog } from "@/features/email-logs/types/email-log.types";
import {
	formatEmailLogDate,
	formatEmailLogMetadataSummary,
	formatEmailLogStatus,
	formatEmailLogTemplateKey,
	formatMetadataJson,
	formatShortId
} from "@/features/email-logs/utils/email-log-format";

interface EmailLogDetailsProps {
	log: EmailLog;
}

export function EmailLogDetails({ log }: EmailLogDetailsProps) {
	return (
		<div className="grid gap-5">
			<section className="grid gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<StatusBadge status={log.status} />
					<Badge variant="outline">{formatEmailLogTemplateKey(log.templateKey)}</Badge>
				</div>
				<p className="text-muted-foreground text-sm">{formatEmailLogMetadataSummary(log)}</p>
			</section>

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Recipient</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailItem label="Email" value={log.toEmail} />
					<DetailItem label="Name" value={log.toName ?? "Not provided"} />
				</div>
			</section>

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Email details</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailItem label="Subject" value={log.subject} className="sm:col-span-2" />
					<DetailItem label="Template" value={formatEmailLogTemplateKey(log.templateKey)} />
					<DetailItem label="Provider ID" value={log.smtpProviderId ? formatShortId(log.smtpProviderId) : "None"} />
					<DetailItem label="Log ID" value={log.id} />
				</div>
			</section>

			{log.status === "failed" && log.errorMessage ? (
				<>
					<Separator />
					<section className="grid gap-3">
						<h3 className="text-sm font-medium text-destructive">Error</h3>
						<p className="text-destructive text-sm">{log.errorMessage}</p>
					</section>
				</>
			) : null}

			<Separator />

			<section className="grid gap-3">
				<h3 className="text-sm font-medium">Timestamps</h3>
				<div className="grid gap-3 sm:grid-cols-2">
					<DetailItem label="Created" value={formatEmailLogDate(log.createdAt)} />
					<DetailItem label="Updated" value={formatEmailLogDate(log.updatedAt)} />
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

function StatusBadge({ status }: { status: string }) {
	const variant =
		status === "sent"
			? "default"
			: status === "failed"
				? "destructive"
				: "secondary";

	return <Badge variant={variant}>{formatEmailLogStatus(status)}</Badge>;
}
