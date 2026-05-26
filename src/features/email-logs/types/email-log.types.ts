export const emailLogStatusValues = ["sent", "failed"] as const;
export const emailLogSortValues = ["toEmail", "status", "templateKey", "createdAt"] as const;
export const emailLogSortDirectionValues = ["asc", "desc"] as const;

export type EmailLogStatus = (typeof emailLogStatusValues)[number];
export type EmailLogSort = (typeof emailLogSortValues)[number];
export type EmailLogSortDirection = (typeof emailLogSortDirectionValues)[number];

export interface EmailLog {
	id: string;
	smtpProviderId: string | null;
	toEmail: string;
	toName: string | null;
	subject: string;
	templateKey: string | null;
	status: EmailLogStatus;
	errorMessage: string | null;
	metadata: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export type EmailLogListResponse = PaginatedData<EmailLog>;

export interface EmailLogListQuery {
	page: number;
	pageSize: number;
	providerId?: string;
	toEmail?: string;
	status?: EmailLogStatus;
	templateKey?: string;
	fromDate?: string;
	toDate?: string;
	sort: EmailLogSort;
	dir: EmailLogSortDirection;
}
