"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
    getMovieById,
    getMovieVideos,
    getMovieCredits,
    getSimilarMovies,
    TMDB_IMAGE_BASE,
} from "@/resources/make-request/api-calls";
import MovieRow from "@/resources/components/movie-row";
import styles from "./movie-details.module.scss";

const MovieDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();

    /** 1. Fetch Movie Details */
    const { data: movie, isLoading: loadingMovie } = useQuery({
        queryKey: ["movie", id],
        queryFn: () => getMovieById(id),
        enabled: !!id,
    });

    /** 2. Fetch Videos (Trailer) */
    const { data: videosData } = useQuery({
        queryKey: ["movieVideos", id],
        queryFn: () => getMovieVideos(id),
        enabled: !!id,
    });

    /** 3. Fetch Credits (Cast) */
    const { data: creditsData } = useQuery({
        queryKey: ["movieCredits", id],
        queryFn: () => getMovieCredits(id),
        enabled: !!id,
    });

    /** 4. Fetch Similar Movies */
    const { data: similarData } = useQuery({
        queryKey: ["movieSimilar", id],
        queryFn: () => getSimilarMovies(id),
        enabled: !!id,
    });

    if (loadingMovie) {
        return <div className={styles.cf_loading}>Loading...</div>; // Could be better
    }

    if (!movie) return null;

    // Process Data
    const trailer = videosData?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    );
    const cast = creditsData?.cast?.slice(0, 10) || []; // Top 10 cast
    const similarMovies = similarData?.results || [];

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={styles.cf_details_container}>
            {/* Back Button */}
            <button onClick={handleBack} className={styles.cf_back_btn}>
                ←
            </button>

            {/* Hero Section */}
            <div className={styles.cf_hero}>
                <div
                    className={styles.cf_backdrop}
                    style={{
                        backgroundImage: `url(${TMDB_IMAGE_BASE}/original${movie.backdrop_path})`,
                    }}
                />

                <div className={styles.cf_hero_content}>
                    <h1>{movie.title}</h1>

                    <div className={styles.cf_meta_row}>
                        <span className={styles.cf_match}>{Math.round(movie.vote_average * 10)}% Match</span>
                        <span className={styles.cf_year}>{movie.release_date?.split("-")[0]}</span>
                        <span className={styles.cf_rating_box}>{movie.adult ? "18+" : "13+"}</span>
                        <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    </div>

                    <div className={styles.cf_actions}>
                        <button className={styles.cf_btn_play}>
                            <span>▶</span> Play
                        </button>
                        <button className={styles.cf_btn_secondary}>
                            <span>+</span> My List
                        </button>
                    </div>

                    <p className={styles.cf_overview}>{movie.overview}</p>
                </div>
            </div>

            {/* Cast Section */}
            {cast.length > 0 && (
                <section className={styles.cf_section}>
                    <h3>Top Cast</h3>
                    <div className={styles.cf_cast_list}>
                        {cast.map((person) => (
                            <div key={person.id} className={styles.cf_cast_card}>
                                {person.profile_path ? (
                                    <img
                                        src={`${TMDB_IMAGE_BASE}/w185${person.profile_path}`}
                                        alt={person.name}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div style={{ height: '100%', background: '#333' }} />
                                )}
                                <div className={styles.cf_cast_info}>
                                    <p>{person.name}</p>
                                    <span>{person.character}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Similar Movies Section */}
            {similarMovies.length > 0 && (
                <section className={styles.cf_section}>
                    <h3>More Like This</h3>
                    {/* Reuse MovieRow but ensuring it handles links correctly.
                         The User requested ALL movie clicks open this page.
                         We will update MovieRow to wrap cards in Links next.
                         So passing similarMovies here will automatically work once MovieRow is updated.
                      */}
                    <MovieRow title="" movies={similarMovies} />
                </section>
            )}
        </div>
    );
};

export default MovieDetailsPage;
