import { type AxiosRequestConfig } from "axios";

import { normalizeApiError } from "@/lib/api/errors";
import axiosClientApi from "@/lib/client-api";

export async function apiClient<TData>(config: AxiosRequestConfig): Promise<TData> {
	try {
		const { data: response } = await axiosClientApi<ApiResponse<TData>>(config);
		return response.data;
	} catch (error) {
		throw normalizeApiError(error);
	}
}

