import gql from 'graphql-tag';

export const paginationTypeDefs = gql`
	input PaginationInput {
		page: Int
		perPage: Int
	}
	type Pagination {
		page: Int!
		perPage: Int!
		totalPages: Int!
	}
`;
