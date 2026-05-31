"use client";

import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";

import { apiRoute, route } from "@/routes/routes";

// Cache for CSRF token
let csrfTokenCache: string | null = null;
let isFetchingToken = false; // Prevent concurrent token fetches
let isRedirecting = false; // Prevent multiple concurrent 401 redirects

const axiosClientApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true, // Ensures cookies are included in requests
	headers: {
		"ngrok-skip-browser-warning": "true"
	}
});

// Function to fetch and cache CSRF token
const fetchAndCacheCSRFToken = async (): Promise<string | null> => {
	if (!isFetchingToken) {
		isFetchingToken = true;
		try {
			const response = await axiosClientApi.get<ApiResponse<string>>(apiRoute.csrf);
			if (response.data?.statusCode === 200) {
				csrfTokenCache = response.data.data; // Cache the token
				console.log("CSRF token refreshed");
			} else {
				console.log("Unexpected CSRF response:", response.data);
				csrfTokenCache = null;
			}
		} catch (error) {
			console.log("Error fetching CSRF token:", error);
			csrfTokenCache = null; // Reset cache on error
		} finally {
			isFetchingToken = false;
		}
	}
	// Wait for token fetch to complete (in case of concurrent calls)
	while (isFetchingToken) {
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	return csrfTokenCache;
};

// Add interceptor to include CSRF token in requests
axiosClientApi.interceptors.request.use(
	async (config: InternalAxiosRequestConfig) => {
		if (
			config.method &&
			config.method.toLowerCase() !== "get" && // Only for non-GET requests
			!config.headers?.["X-CSRF-Token"] // If the CSRF token is not already set
		) {
			if (!csrfTokenCache) {
				await fetchAndCacheCSRFToken();
			}
			if (csrfTokenCache) {
				// Ensure headers are an AxiosHeaders instance
				if (!config.headers) {
					config.headers = new AxiosHeaders();
				}
				config.headers.set("X-CSRF-Token", csrfTokenCache);
			}
		}
		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

// Add interceptor to handle token expiration or invalidation
axiosClientApi.interceptors.response.use(
	response => response,
	async (error: AxiosError) => {
		// Handle 401 Unauthorized — session expired or 2FA required
		if (error.response?.status === 401 && !isRedirecting) {
			isRedirecting = true;
			// Clear CSRF cache since session is invalid
			csrfTokenCache = null;

			const currentPath = window.location.pathname + window.location.search;
			const errorData = error.response?.data as { code?: string } | undefined;

			// If 2FA is required, redirect to 2FA verify page instead of login
			if (errorData?.code === "two_factor_required") {
				const verifyUrl = `${route.protected.twoFactorVerify}?redirect=${encodeURIComponent(currentPath)}`;
				window.location.replace(verifyUrl);
			} else {
				// Redirect to login with current page as redirect target
				const loginUrl = `${route.protected.login}?redirect=${encodeURIComponent(currentPath)}`;
				window.location.replace(loginUrl);
			}
			return Promise.reject(error);
		}

		// Handle 403 Forbidden — CSRF token invalid, try to refresh
		if (error.response?.status === 403) {
			console.log("CSRF token invalid or expired. Refreshing token...");
			await fetchAndCacheCSRFToken(); // Refresh token
			const originalRequest = error.config; // Get the failed request
			if (originalRequest && csrfTokenCache) {
				if (!originalRequest.headers) {
					originalRequest.headers = new AxiosHeaders();
				}
				originalRequest.headers.set("X-CSRF-Token", csrfTokenCache);
				return axiosClientApi(originalRequest); // Retry the failed request
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClientApi;
