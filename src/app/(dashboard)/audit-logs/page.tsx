import { AuditLogsPage } from "@/features/audit-logs/components/audit-logs-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Audit Logs",
	description: "Audit logs page of the Next.js boilerplate."
};

export default function AuditLogs() {
	return <AuditLogsPage />;
}
