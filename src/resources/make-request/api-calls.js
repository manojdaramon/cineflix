/**
 * api-calls.js — Central file for all TMDB API endpoint functions.
 *
 * Each function calls makeRequest() and returns data.
 * Components use these with useQuery() or useMutation() from TanStack Query.
 *
 * TMDB API docs: https://developer.themoviedb.org/reference
 * Image base URL: https://image.tmdb.org/t/p/{size}/{path}
 *   Poster sizes: w92, w154, w185, w342, w500, w780, original
 *   Backdrop sizes: w300, w780, w1280, original
 */

/** Local imports */
import makeRequest from "@/resources/make-request";

/** TMDB config from environment variables */
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_TOKEN = process.env.NEXT_PUBLIC_TMDB_TOKEN;

/** Base URL for TMDB images */
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

// ─────────────────────────────────────────────
//  🎬 Movies — Now Playing
// ─────────────────────────────────────────────

/**
 * Fetches the list of movies currently playing in theatres.
 *
 * @param {number} [page=1] - The page number to fetch (TMDB paginates results).
 * @returns {Promise<Object>} The now playing movies data including results array.
 */
export const getNowPlayingMovies = async (page = 1) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/now_playing?language=en-US&page=${page}`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  🎬 Movies — Popular
// ─────────────────────────────────────────────

/**
 * Fetches a list of popular movies.
 *
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<Object>} The popular movies data.
 */
export const getPopularMovies = async (page = 1) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/popular?language=en-US&page=${page}`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  🎬 Movies — Details
// ─────────────────────────────────────────────

/**
 * Fetches details for a single movie by ID.
 *
 * @param {number} movieId - The TMDB movie ID.
 * @returns {Promise<Object>} The movie details.
 */
export const getMovieById = async (movieId) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/${movieId}?language=en-US`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  🎥 Movies — Videos / Trailers
// ─────────────────────────────────────────────

/**
 * Fetches the videos (trailers, teasers, etc.) for a given movie.
 *
 * @param {number} movieId - The TMDB movie ID.
 * @returns {Promise<Object>} The videos data including results array.
 */
export const getMovieVideos = async (movieId) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?language=en-US`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  🔍 Movies — Search
// ─────────────────────────────────────────────

/**
 * Searches for movies matching a query string.
 *
 * @param {string} query - The search term.
 * @param {number} [page=1] - The page number to fetch.
 * @returns {Promise<Object>} The search results data including results array.
 */
export const searchMovies = async (query, page = 1) => {
    return makeRequest(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  👥 Movies — Credits / Cast
// ─────────────────────────────────────────────

/**
 * Fetches the cast and crew for a given movie.
 *
 * @param {number} movieId - The TMDB movie ID.
 * @returns {Promise<Object>} The credits data including cast and crew arrays.
 */
export const getMovieCredits = async (movieId) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/${movieId}/credits?language=en-US`,
        { token: TMDB_TOKEN }
    );
};

// ─────────────────────────────────────────────
//  🎬 Movies — Similar
// ─────────────────────────────────────────────

/**
 * Fetches a list of similar movies based on the given movie.
 *
 * @param {number} movieId - The TMDB movie ID.
 * @returns {Promise<Object>} The similar movies data including results array.
 */
export const getSimilarMovies = async (movieId) => {
    return makeRequest(
        `${TMDB_BASE_URL}/movie/${movieId}/similar?language=en-US&page=1`,
        { token: TMDB_TOKEN }
    );
};
