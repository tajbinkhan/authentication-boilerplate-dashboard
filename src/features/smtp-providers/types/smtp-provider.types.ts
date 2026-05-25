export type EmailProviderType = "brevo" | "resend" | "nodemailer" | "aws-ses";
export const emailProviderTypeValues = ["brevo", "resend", "nodemailer", "aws-ses"] as const;

export const smtpProviderSortValues = [
	"name",
	"providerType",
	"isDefault",
	"isActive",
	"lastTestStatus",
	"createdAt",
	"updatedAt"
] as const;
export const smtpProviderSortDirectionValues = ["asc", "desc"] as const;

export type SmtpProviderSort = (typeof smtpProviderSortValues)[number];
export type SmtpProviderSortDirection = (typeof smtpProviderSortDirectionValues)[number];

export interface SmtpProvider {
	id: string;
	name: string;
	providerType: EmailProviderType;
	config: Record<string, unknown>;
	isDefault: boolean;
	isActive: boolean;
	lastTestedAt: string | null;
	lastTestStatus: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface SmtpProviderListQuery {
	page: number;
	pageSize: number;
	search?: string;
	providerType?: string;
	isActive?: string;
	fromDate?: string;
	toDate?: string;
	sort: SmtpProviderSort;
	dir: SmtpProviderSortDirection;
}

export interface SmtpProviderListResponse {
	rows: SmtpProvider[];
	total: number;
	page: number;
	pageSize: number;
}

export interface CreateSmtpProviderInput {
	name: string;
	providerType: EmailProviderType;
	config: Record<string, unknown>;
}

export interface UpdateSmtpProviderInput {
	id: string;
	name?: string;
	config?: Record<string, unknown>;
}

export interface TestConnectionResult {
	success: boolean;
	message: string;
}

export interface BrevoConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
}

export interface ResendConfig {
	apiKey: string;
	senderEmail: string;
	senderName: string;
}

export interface NodemailerConfig {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
	senderEmail: string;
	senderName: string;
}

export interface AwsSesConfig {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	senderEmail: string;
	senderName: string;
}
