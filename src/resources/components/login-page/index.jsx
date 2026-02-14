"use client";

/** React imports */
import React, { useState, useMemo } from "react";

/** Libraries */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
} from "firebase/auth";
import { auth } from "@/resources/components/firebase/firebase";

/** Local imports */
import CustomInput from "@/resources/components/form-utilities/custom-input";
import formConfig from "@/constants/form-fields.json";

/** Styles */
import styles from "./login-page.module.scss";

const { loginFields } = formConfig;

const getSchema = (isSignUp) =>
    yup.object().shape({
        ...(isSignUp && {
            fullName: yup
                .string()
                .required(loginFields.fullName.validation.required),
        }),
        email: yup
            .string()
            .email(loginFields.email.validation.email)
            .required(loginFields.email.validation.required),
        password: yup
            .string()
            .min(
                loginFields.password.validation.minLength,
                loginFields.password.validation.min
            )
            .required(loginFields.password.validation.required),
    });

/** Maps Firebase error codes to user-friendly messages */
const getFirebaseErrorMessage = (code) => {
    const messages = {
        "auth/email-already-in-use": "This email is already registered. Try signing in.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid credentials. Please try again.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/popup-closed-by-user": "Google sign-in was cancelled.",
        "auth/weak-password": "Password should be at least 6 characters.",
    };
    return messages[code] || "Something went wrong. Please try again.";
};

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const schema = useMemo(() => getSchema(isSignUp), [isSignUp]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    /**
     * Email / Password — Sign Up or Sign In
     *
     * Sign-Up: Uses Firebase directly (NextAuth doesn't handle registration),
     *          then auto-signs-in via NextAuth.
     * Sign-In: Uses NextAuth's signIn("credentials") which calls the
     *          authorize() function in auth.js → Firebase validation.
     */
    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            if (isSignUp) {
                // Step 1: Create the user in Firebase
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    data.email,
                    data.password
                );

                // Step 2: Save the display name
                if (data.fullName) {
                    await updateProfile(userCredential.user, {
                        displayName: data.fullName,
                    });
                }

                // Step 3: Auto sign-in via NextAuth after registration
                const result = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error("Account created but auto sign-in failed. Please sign in manually.");
                } else {
                    // Redirect to home on success
                    window.location.href = "/";
                }
            } else {
                // Sign in via NextAuth → calls authorize() in auth.js
                const result = await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    redirect: false,
                });

                if (result?.error) {
                    toast.error("Invalid credentials. Please try again.");
                } else {
                    // Redirect to home on success
                    window.location.href = "/";
                }
            }
        } catch (err) {
            toast.error(getFirebaseErrorMessage(err.code));
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Google Sign-In via NextAuth
     * Redirects to Google's OAuth consent screen.
     * On success, NextAuth handles the callback and sets the session cookie.
     */
    const handleGoogleSignIn = async () => {
        setIsLoading(true);

        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (err) {
            toast.error("Google sign-in failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cf_login_wrapper}>
            <div className={styles.cf_login_card}>
                <header className={styles.cf_login_header}>
                    <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
                </header>



                <form onSubmit={handleSubmit(onSubmit)}>
                    {Object.entries(loginFields)
                        .filter(
                            ([, fieldConfig]) =>
                                !fieldConfig.signUpOnly || isSignUp
                        )
                        .map(([fieldName, fieldConfig]) => (
                            <CustomInput
                                key={fieldName}
                                name={fieldName}
                                type={fieldConfig.type}
                                placeholder={fieldConfig.placeholder}
                                autoComplete={fieldConfig.autoComplete}
                                register={register}
                                error={errors[fieldName]}
                                disabled={isLoading}
                            />
                        ))}

                    <button
                        type="submit"
                        className={styles.cf_submit_btn}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <span className={styles.cf_spinner} />
                        )}
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                {!isSignUp && (
                    <button
                        type="button"
                        className={styles.cf_forgot_password}
                        disabled={isLoading}
                        onClick={async () => {
                            const email = document.querySelector('input[name="email"]')?.value;
                            if (!email) {
                                toast.error("Please enter your email address first.");
                                return;
                            }

                            setIsLoading(true);
                            try {
                                await sendPasswordResetEmail(auth, email);
                                toast.success("Password reset email sent! Check your inbox.");
                            } catch (err) {
                                toast.error(getFirebaseErrorMessage(err.code));
                            } finally {
                                setIsLoading(false);
                            }
                        }}
                    >
                        Forgot Password?
                    </button>
                )}

                {/* ---- OR divider ---- */}
                <div className={styles.cf_divider}>
                    <span>OR</span>
                </div>

                {/* Google sign-in via NextAuth */}
                <button
                    type="button"
                    className={styles.cf_google_btn}
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    <svg viewBox="0 0 48 48" width="20" height="20">
                        <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.5 30.3 0 24 0 14.6 0 6.7 5.5 2.7 13.5l7.9 6.2C12.6 13.3 17.9 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 6.9-10.1 6.9-17.5z" />
                        <path fill="#FBBC05" d="M10.5 28.3c-1-3-1-6.3 0-9.3l-7.9-6.2C.9 16.9 0 20.3 0 24s.9 7.1 2.6 10.2l7.9-6z" />
                        <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.5-5.8c-2.2 1.5-5 2.4-8.5 2.4-6.1 0-11.4-3.8-13.4-9.2l-7.9 6C6.7 42.5 14.6 48 24 48z" />
                    </svg>
                    Sign in with Google
                </button>

                <footer className={styles.cf_login_footer}>
                    <p>
                        {isSignUp ? "Already registered? " : "New to Cineflix? "}
                        <span
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                reset();
                            }}
                        >
                            {isSignUp ? "Sign In" : "Sign up now"}
                        </span>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Login;