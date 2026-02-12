"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import Image from "next/image"; // ✅ Add this

/** Local imports */
import CustomInput from "@/resources/components/form-utilities/custom-input";
import formConfig from "@/constants/form-fields.json";

/** Styles */
import styles from "./login-page.module.scss";

const { loginFields } = formConfig;

const schema = yup.object().shape({
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

const Login = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        setAuthError("");
        setIsLoading(true);

        try {
            console.log("Login data:", data);
        } catch (err) {
            setAuthError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.cf_login_wrapper}>
            <div className={styles.cf_login_card}>
                <header className={styles.cf_login_header}>
                    <h1>{isSignUp ? "Sign Up" : "Sign In"}</h1>
                </header>

                {authError && (
                    <div className={styles.cf_auth_error}>{authError}</div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    {Object.entries(loginFields).map(
                        ([fieldName, fieldConfig]) => (
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
                        )
                    )}

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

                <footer className={styles.cf_login_footer}>
                    <p>
                        {isSignUp ? "Already registered? " : "New to Cineflix? "}
                        <span onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? "Sign In" : "Sign up now"}
                        </span>
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default Login;