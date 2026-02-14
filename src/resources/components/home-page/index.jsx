"use client";

/** React imports */
import React, { useState, useEffect } from "react";

/** Libraries */
import { useQuery } from "@tanstack/react-query";

/** Local imports */
import { useAuth } from "@/resources/context/auth-context";
import {
    getNowPlayingMovies,
    getMovieVideos,
    TMDB_IMAGE_BASE,
} from "@/resources/make-request/api-calls";
import MovieRow from "@/resources/components/movie-row";

/** Styles */
import styles from "./home-page.module.scss";

/**
 * HomePage — displays "Now Playing" movies from TMDB.
 *
 * Uses TanStack Query to fetch and cache the movie list.
 * Shows the featured movie's YouTube trailer in the hero,
 * and a grid of poster cards below.
 */
const HomePage = () => {
    const { user, signOut } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    /** Toggle navbar background on scroll */
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /** Fetch now playing movies */
    const { data, isLoading, error } = useQuery({
        queryKey: ["nowPlayingMovies"],
        queryFn: () => getNowPlayingMovies(),
    });

    /** Extract the movies array from the response */
    const movies = data?.results || [];

    /** Pick the first movie with a backdrop as the hero feature */
    const featuredMovie = movies.find((m) => m.backdrop_path) || null;

    /**
     * Fetch trailer for the featured movie.
     *
     * enabled: only runs when we have a featured movie id.
     * This is a dependent query — it waits for the first query to finish.
     */
    const { data: videosData } = useQuery({
        queryKey: ["movieVideos", featuredMovie?.id],
        queryFn: () => getMovieVideos(featuredMovie.id),
        enabled: !!featuredMovie?.id,
    });

    /**
     * Find the best trailer from the videos list.
     * Priority: Official Trailer > any Trailer > any Teaser > first video
     * Only YouTube videos are supported for embedding.
     */
    const youtubeVideos = (videosData?.results || []).filter(
        (v) => v.site === "YouTube"
    );
    const trailerKey =
        youtubeVideos.find((v) => v.type === "Trailer" && v.official)?.key ||
        youtubeVideos.find((v) => v.type === "Trailer")?.key ||
        youtubeVideos.find((v) => v.type === "Teaser")?.key ||
        youtubeVideos[0]?.key ||
        null;

    return (
        <div className={styles.cf_home_wrapper}>
            {/* ── Navbar ── */}
            <nav className={`${styles.cf_home_nav} ${isScrolled ? styles.cf_home_nav_scrolled : ""}`}>
                <h2 className={styles.cf_logo}>CINEFLIX</h2>
                <div className={styles.cf_nav_right}>
                    <span className={styles.cf_user_name}>
                        {user?.name || user?.email}
                    </span>
                    <button
                        className={styles.cf_signout_btn}
                        onClick={signOut}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* ── Hero Section — Featured Movie with Trailer ── */}
            {featuredMovie && (
                <section className={styles.cf_hero}>
                    {/* Video background or fallback image */}
                    {trailerKey ? (
                        <div className={styles.cf_video_container}>
                            <iframe
                                className={styles.cf_video_iframe}
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&loop=1&playlist=${trailerKey}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`}
                                title={`${featuredMovie.title} Trailer`}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div
                            className={styles.cf_hero_backdrop}
                            style={{
                                backgroundImage: `url(${TMDB_IMAGE_BASE}/w1280${featuredMovie.backdrop_path})`,
                            }}
                        />
                    )}

                    {/* Gradient overlays */}
                    <div className={styles.cf_hero_gradient} />

                    {/* Movie info overlay */}
                    <div className={styles.cf_hero_content}>
                        <h1>{featuredMovie.title}</h1>
                        <p>{featuredMovie.overview}</p>
                        <div className={styles.cf_hero_meta}>
                            <span className={styles.cf_rating}>
                                ⭐ {featuredMovie.vote_average?.toFixed(1)}
                            </span>
                            <span className={styles.cf_release_date}>
                                {featuredMovie.release_date}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Now Playing Section ── */}
            <section className={styles.cf_now_playing}>
                {/* Loading state */}
                {isLoading && (
                    <div className={styles.cf_loading}>
                        <div className={styles.cf_spinner} />
                        <p>Loading movies...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className={styles.cf_error}>
                        <p>Failed to load movies: {error.message}</p>
                    </div>
                )}

                {/* Movie Carousel */}
                {!isLoading && !error && (
                    <MovieRow title="Now Playing" movies={movies} />
                )}
            </section>
        </div>
    );
};

export default HomePage;
