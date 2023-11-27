import gql from 'graphql-tag';

export const movieTypeDefs = gql`
	type Movie {
		id: ID
		title: String
		posterUrl: String
		summary: String
		duration: String
		directors: [String]
		mainActors: [String]
		datePublished: String
		rating: String
		ratingValue: Float
		bestRating: Float
		worstRating: Float
		writers: [String]
		genres: [GenreWithoutMovies]
	}

	type MovieConnection {
		nodes: [Movie!]
		pagination: Pagination
	}

	input MovieFilterInput {
		search: String
		genre: String
	}

	type Query {
		"Single Movie by ID"
		movie(id: ID!): Movie

		"Paginated list of Movies with simple search"
		movies(pagination: PaginationInput, where: MovieFilterInput): MovieConnection
	}
`;
