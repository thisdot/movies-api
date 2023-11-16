export type DataWithPaginationResponse<T> = {
	data: Array<T>;
	totalPages: number;
};

export type GenreResponse = {
	id: string;
	title: string | null;
	totalMovies: number;
};
