"use client";

/** React imports */
import React, { useState } from "react";

/** Libraries */

/** Local imports */

/** Styles */
import styles from "@/app/styles/forms.module.scss";

/**
 * Reusable custom input component for GrantFunds forms.
 *
 * @param {Object} props - Component props.
 * @param {string} props.label - The label for the input.
 * @param {string} props.type - The HTML input type.
 * @param {string} props.placeholder - The placeholder text.
 * @param {Object} props.error - The validation error object from react-hook-form.
 * @param {Object} props.register - The registration object from react-hook-form.
 * @param {string} props.name - The name of the input field.
 * @param {boolean} props.disabled - Whether the input is disabled.
 * @param {string} props.autoComplete - The autocomplete attribute.
 * @returns {JSX.Element} The rendered CustomInput component.
 */
const CustomInput = ({
    label,
    type = "text",
    placeholder,
    error,
    register,
    name,
    disabled = false,
    autoComplete,
    ...rest
}) => {
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Toggles the password visibility.
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isPassword = type === "password";
    const isTextarea = type === "textarea";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className={styles.cf_form_group}>
            {label && (
                <label className={styles.cf_label} htmlFor={name}>
                    {label}
                </label>
            )}
            <div className={styles.cf_input_wrapper}>
                {isTextarea ? (
                    <textarea
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={4}
                        {...(register ? register(name) : {})}
                        {...rest}
                    />
                ) : (
                    <input
                        id={name}
                        type={inputType}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        disabled={disabled}
                        {...(register ? register(name) : {})}
                        {...rest}
                    />
                )}
                {isPassword && (
                    <button
                        type="button"
                        className={styles.cf_visibility_toggle}
                        onClick={togglePasswordVisibility}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && <span className={styles.cf_field_error}>{error.message}</span>}
        </div>
    );
};

export default CustomInput;
