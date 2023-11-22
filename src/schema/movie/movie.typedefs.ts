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
		"Movie: GET"
		movie(id: ID!): Movie
		movies(pagination: PaginationInput, where: MovieFilterInput): MovieConnection
	}
`;
