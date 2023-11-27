import gql from 'graphql-tag';

export const genreTypeDefs = gql`
	type Genre {
		id: ID
		title: String
		movies: [Movie]
	}

	type GenreWithoutMovies {
		id: ID
		title: String
	}

	type Genre {
		id: ID
		title: String
		movies: [Movie]
	}

	type GenreConnection {
		nodes: [Genre!]
		pagination: Pagination
	}

	type Query {
		"Single Genre by ID"
		genre(id: ID!): Genre

		"Paginated list of Genres"
		genres(pagination: PaginationInput): GenreConnection
	}
`;
