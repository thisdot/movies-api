import gql from 'graphql-tag';

export const genreTypeDefs = gql`
	type MovieInGenre {
		id: ID!
	}

	type Genre {
		id: ID!
		title: String
		movies: [MovieInGenre]
	}

	type GenreConnection {
		nodes: [Genre!]
		pagination: Pagination
	}

	type Query {
		"Genre: GET"
		genre(id: ID!): Genre
		genres(pagination: PaginationInput): GenreConnection
	}
`;