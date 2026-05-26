export interface EmailTemplate {
	publicId: string;
	key: string;
	subject: string;
	html: string;
	text: string | null;
	version: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface EmailTemplateListResponse {
	rows: EmailTemplate[];
	total: number;
	page: number;
	pageSize: number;
}

export const emailTemplateSortValues = [
	"key",
	"subject",
	"version",
	"isActive",
	"createdAt",
	"updatedAt"
] as const;
export const emailTemplateSortDirectionValues = ["asc", "desc"] as const;

export type EmailTemplateSort = (typeof emailTemplateSortValues)[number];
export type EmailTemplateSortDirection = (typeof emailTemplateSortDirectionValues)[number];

export interface EmailTemplateListQuery {
	page: number;
	pageSize: number;
	search?: string;
	isActive?: string;
	fromDate?: string;
	toDate?: string;
	sort: EmailTemplateSort;
	dir: EmailTemplateSortDirection;
}

export interface UpdateEmailTemplateInput {
	publicId: string;
	subject?: string;
	html?: string;
	text?: string;
	isActive?: boolean;
}
