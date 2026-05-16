interface GlobalLayoutProps {
	children: React.ReactNode;
}

interface GlobalLayoutPropsWithLocale {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

interface GlobalValues {
	[key: string]: string | string[] | undefined;
}

interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data: T;
	timestamp: string;
	path: string;
}

interface PaginatedData<T> {
	rows: T[];
	total: number;
	page: number;
	pageSize: number;
}

type PaginatedApiResponse<T> = ApiResponse<PaginatedData<T>>;
