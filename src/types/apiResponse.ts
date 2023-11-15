export type DataWithPaginationResponse<T> = {
	data: Array<T>;
	totalPages: number;
};
