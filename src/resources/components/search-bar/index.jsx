"use client";

/** React imports */
import React from "react";
import Link from "next/link";

/** Styles */
import styles from "./search-bar.module.scss";

/**
 * SearchBar — Navbar "GPT Search" Button.
 *
 * Navigates to the dedicated /search page.
 * Designed to look like an AI/Smart feature.
 */
const SearchBar = () => {
    return (
        <div className={styles.cf_search_wrapper}>
            <Link href="/search" className={styles.cf_gpt_search_btn}>
                <svg
                    className={styles.cf_ai_icon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" opacity="0.5" />
                    <path d="M22 5h-4V1h-2v4h-4v2h4v4h2V7h4z" />
                    {/* Replaced generic pluses with a sparkle shape */}
                    <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74 0-2.49-2.01-4.5-4.5-4.5S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74z" style={{ display: 'none' }} />
                    <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3z" />
                </svg>
                <span className={styles.cf_btn_text}>GPT Search</span>
            </Link>
        </div>
    );
};

export default SearchBar;
