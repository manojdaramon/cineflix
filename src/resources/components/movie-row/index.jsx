"use client";

/** React imports */
import React from "react";

/** Libraries */
import { TMDB_IMAGE_BASE } from "@/resources/make-request/api-calls";

/** Styles */
import styles from "./movie-row.module.scss";

/**
 * MovieRow — A horizontal, auto-scrolling carousel (marquee) of movie posters.
 *
 * Features:
 *  - Auto-scrolls endlessly using CSS Animation
 *  - Pauses on hover
 *  - Fade gradients on left/right
 *  - Flexbox layout
 *
 * @param {Object} props
 * @param {string} props.title - The section title (e.g. "Now Playing")
 * @param {Array} props.movies - Array of movie objects from TMDB
 */
const MovieRow = ({ title, movies = [] }) => {
    // Duplicate the movies to create a seamless loop
    const loopedMovies = [...movies, ...movies];

    if (!movies.length) return null;

    return (
        <div className={styles.cf_row_wrapper}>
            <h2 className={styles.cf_row_title}>{title}</h2>

            <div className={styles.cf_carousel_container}>
                {/* Left fade gradient */}
                <div className={`${styles.cf_fade} ${styles.cf_fade_left}`} />

                {/* Auto-scrolling Row */}
                <div className={styles.cf_movie_row}>
                    {loopedMovies.map((movie, index) => (
                        <div
                            // Use index in key because we have duplicates
                            key={`${movie.id}-${index}`}
                            className={styles.cf_movie_card}
                        >
                            {movie.poster_path ? (
                                <img
                                    src={`${TMDB_IMAGE_BASE}/w342${movie.poster_path}`}
                                    alt={movie.title}
                                    className={styles.cf_movie_poster}
                                    loading="lazy"
                                />
                            ) : (
                                <div className={styles.cf_no_poster}>
                                    <span>No Image</span>
                                </div>
                            )}

                            <div className={styles.cf_movie_overlay}>
                                <h3 className={styles.cf_movie_title}>
                                    {movie.title}
                                </h3>
                                <div className={styles.cf_movie_info}>
                                    <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                                    <span>{movie.release_date?.split("-")[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right fade gradient */}
                <div className={`${styles.cf_fade} ${styles.cf_fade_right}`} />
            </div>
        </div>
    );
};

export default MovieRow;
