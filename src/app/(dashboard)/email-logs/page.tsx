import { EmailLogsPage } from "@/features/email-logs/components/email-logs-page";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Email Logs",
	description: "View email logs."
};

export default function Page() {
	return <EmailLogsPage />;
}

