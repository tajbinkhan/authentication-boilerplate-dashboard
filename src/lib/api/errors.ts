import axios from "axios";

export type ApiErrorPayload = {
	statusCode: number;
	code: string;
	error?: string;
	message: string;
	meta?: Record<string, unknown>;
	timestamp?: string;
	path?: string;
	requestId?: string;
};

export class ApiError extends Error {
	constructor(
		public readonly payload: ApiErrorPayload,
		public readonly statusCode: number
	) {
		super(payload.message);
		this.name = "ApiError";
	}

	get code(): string {
		return this.payload.code;
	}
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function getString(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function getNumber(value: unknown): number | undefined {
	return typeof value === "number" ? value : undefined;
}

function getMeta(value: unknown): Record<string, unknown> | undefined {
	return isRecord(value) ? value : undefined;
}

export function normalizeApiError(error: unknown): ApiError {
	if (error instanceof ApiError) return error;

	if (axios.isAxiosError(error)) {
		const data = error.response?.data;
		const payloadData = isRecord(data) ? data : {};
		const statusCode =
			getNumber(payloadData.statusCode) ?? error.response?.status ?? 500;
		const message =
			getString(payloadData.message) ??
			error.message ??
			"Request failed. Please try again.";

		const payload: ApiErrorPayload = {
			statusCode,
			code:
				getString(payloadData.code) ??
				(statusCode === 401
					? "unauthorized"
					: statusCode === 403
						? "forbidden"
						: "unknown_error"),
			error: getString(payloadData.error),
			message,
			meta: getMeta(payloadData.meta),
			timestamp: getString(payloadData.timestamp),
			path: getString(payloadData.path),
			requestId: getString(payloadData.requestId)
		};

		return new ApiError(payload, statusCode);
	}

	if (error instanceof Error) {
		return new ApiError(
			{
				statusCode: 500,
				code: "unknown_error",
				message: error.message
			},
			500
		);
	}

	return new ApiError(
		{
			statusCode: 500,
			code: "unknown_error",
			message: "Request failed. Please try again."
		},
		500
	);
}
