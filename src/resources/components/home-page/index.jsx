"use client";

import React from "react";
import { useAuth } from "@/resources/context/auth-context";
import styles from "./home-page.module.scss";

const HomePage = () => {
    const { user, signOut } = useAuth();

    return (
        <div className={styles.cf_home_wrapper}>
            {/* Navbar */}
            <nav className={styles.cf_home_nav}>
                <h2 className={styles.cf_logo}>CINEFLIX</h2>
                <div className={styles.cf_nav_right}>
                    <span className={styles.cf_user_name}>
                        {user?.displayName || user?.email}
                    </span>
                    <button
                        className={styles.cf_signout_btn}
                        onClick={signOut}
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className={styles.cf_hero}>
                <div className={styles.cf_hero_content}>
                    <h1>Welcome to Cineflix</h1>
                    <p>
                        Unlimited movies, TV shows, and more. Start exploring
                        now.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
