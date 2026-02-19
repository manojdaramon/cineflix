"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies, TMDB_IMAGE_BASE } from "@/resources/make-request/api-calls";
import Link from "next/link";
import styles from "./search.module.scss";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const inputRef = useRef(null);

    // Auto-focus
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms debounce for "AI" feel
        return () => clearTimeout(timer);
    }, [query]);

    // Search Query
    const { data, isLoading } = useQuery({
        queryKey: ["searchMovies", debouncedQuery],
        queryFn: () => searchMovies(debouncedQuery),
        enabled: debouncedQuery.length >= 2,
    });

    const results = data?.results || [];

    return (
        <div className={styles.cf_search_page}>
            {/* Minimal Header */}
            <header className={styles.cf_search_header}>
                <Link href="/" className={styles.cf_logo}>CINEFLIX</Link>
                <Link href="/" className={styles.cf_close_search}>✕</Link>
            </header>

            <div className={styles.cf_search_container}>
                {/* AI-Ready Input Section */}
                <div className={styles.cf_input_section}>
                    <div className={styles.cf_input_wrapper}>
                        <div className={styles.cf_search_icon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            className={styles.cf_search_input}
                            placeholder="Ask Cineflix... e.g. '80s sci-fi movies'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {isLoading && <div className={styles.cf_loading_spinner} />}
                    </div>
                    {/* Future: AI Suggestions Chips could go here */}
                    <div className={styles.cf_ai_hint}>
                        <svg className={styles.cf_sparkle} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3z" />
                        </svg>
                        <span>Try searching for clear, descriptive queries</span>
                    </div>
                </div>

                {/* Results Grid */}
                <div className={styles.cf_results_grid}>
                    {results.map((movie) => (
                        <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.cf_movie_card}>
                            {movie.poster_path ? (
                                <img
                                    src={`${TMDB_IMAGE_BASE}/w342${movie.poster_path}`}
                                    alt={movie.title}
                                    loading="lazy"
                                />
                            ) : (
                                <div className={styles.cf_no_poster}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                                        <line x1="7" y1="2" x2="7" y2="22"></line>
                                        <line x1="17" y1="2" x2="17" y2="22"></line>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <line x1="2" y1="7" x2="7" y2="7"></line>
                                        <line x1="2" y1="17" x2="7" y2="17"></line>
                                        <line x1="17" y1="17" x2="22" y2="17"></line>
                                        <line x1="17" y1="7" x2="22" y2="7"></line>
                                    </svg>
                                </div>
                            )}
                            <div className={styles.cf_movie_info}>
                                <h4>{movie.title}</h4>
                                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                            </div>
                        </Link>
                    ))}

                    {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && (
                        <div className={styles.cf_no_results}>
                            <svg className={styles.cf_empty_icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="8" y1="15" x2="16" y2="15"></line>
                                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                <line x1="15" y1="9" x2="15.01" y2="9"></line>
                            </svg>
                            <p>No movies found for "{debouncedQuery}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
