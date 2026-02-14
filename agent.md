# Cineflix - Project Rules & Styling Guidelines

> **This file contains mandatory rules for the Cineflix project. All code must comply with these guidelines.**
> The AI assistant will check this file regularly to ensure project compliance.

---

## 🌟 General Philosophy

- **Readability first:** Code must be clear, well-structured, and easy to understand.
- **Consistency:** Follow established patterns for imports, naming, and structure.
- **Robustness:** Handle errors explicitly and provide proactive user feedback.

### Vendor Prefix

- **Use `cf_` as the vendor prefix** for all custom tokens, variables, and identifiers. (Cineflix)
- **Mandatory Class Prefix:** All CSS class names must be prefixed with `cf_` without exception.
    - Example: `.cf_container`, `.cf_btn_primary`, `.cf_login_card`
- Example Tokens: `cf_brand_red`, `cf_text_primary`, `cf_cta_primary`

---

## 📁 1. File & Directory Structure

- **Component Isolation:** Each component resides in its own directory named in `kebab-case` (e.g., `src/resources/components/page-spinner/`).
- **Main File:** The primary component file must be `index.jsx` (for React components).
- **Style Files:** Use SCSS modules named `[component-name].module.scss` within the component directory.
- **Hook Isolation:** Custom hooks reside in a `hooks/` directory, named `use[HookName].js`.
- **Helpers & Utils:**
    - Utility functions reside in a `helpers/` or `utils/` directory.
    - SCSS partials (functions, mixins) use lowercase with underscores: `_functions.scss`, `_mixins.scss`.
- **Location:**
    - Components are generally in `src/resources/components/`.
    - Contexts are in `src/resources/context/`.

---

## 📝 2. Import Organization

Group imports logically with comment headers. Order them as follows:

1. `/** React imports */` (e.g., React, useState, useEffect)
2. `/** Libraries */` (Third-party packages like lodash, framer-motion, NextAuth)
3. `/** Local imports */` (Components, helpers, constants, hooks)
4. `/** Styles */` (CSS modules, global styles)

---

## 🏷️ 3. Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile`, `NavigationMenu`).
- **Functions & Variables:** camelCase (e.g., `fetchUserData`, `isLoading`).
- **Props:** Boolean props should sound like questions (e.g., `isLoading`, `hasError`, `isFullWidth`).
- **Files & Directories:** kebab-case (e.g., `user-profile/`, `api-calls.js`).
- **SCSS Partials:** Lowercase with underscores (e.g., `_functions.scss`).
- **Constants:** UPPER_CASE for global or fixed configuration constants.

---

## 📖 4. Documentation & Comments

- **JSDoc is Mandatory:** Every exported function, utility, or hook must have a JSDoc block describing its purpose, `@param`, and `@returns`.
- **Complex Logic:** Add inline comments explaining _why_ a certain approach was taken, not just _what_ the code does.

---

## 🔗 5. API & Data Fetching

- **Centralized Config:** Avoid using raw `fetch` options everywhere. Use a helper to generate headers and include auth tokens.
- **Deep Error Handling:**
    - Always check `response.ok`.
    - Use `try/catch` blocks for all async calls.
    - Handle specific application error codes.
- **User Feedback:** Use `toast.error()` or `toast.success()` for user-facing messages.
- **Propagation:** Throw descriptive errors for internal propagation when necessary.

---

## 🎨 6. Styling Rules

### SCSS & CSS Modules

- **Modular Scoping:** Always use SCSS modules for component scoping.
- **Class Access:** Access classes via the `styles` object: `className={styles.cf_container}` (note: prefix `cf_` is still part of the name in the SCSS file).
- **No Inline Styles:** Avoid `style={{...}}` unless for strictly dynamic values (like progress bar width).

### Design Tokens (Mandatory)

- **Colors:** Never use hardcoded hex/rgb values in styling. Always use tokens or functions defined in SCSS.
- **Fonts:** Use variables defined in `_functions.scss`:
    - `$font-heading`: For all headings.
    - `$font-body`: For standard text.
- **Breakpoints:** Always use the `respond-to($breakpoint)` mixin.

---

## ⚛️ 7. Component Structure

- **Functional Components:** Use modern functional components with arrow functions or standard declarations.
- **Destructuring:** Destructure props in the function signature.
- **JSX Clarity:** Keep JSX clean. Extract complex rendering logic into sub-functions or child components.
- **Hooks Best Practices:** Custom hooks for reusable logic, correct dependency arrays.

---

## 🔧 8. Indentation & Formatting

- **Indentation:** **Mandatory 4-space indentation** for all JS, JSON, and SCSS files.
- **Tabs:** No tabs allowed.

---

## 📦 9. Package Management & Commits

- **Package Manager:** Use **yarn** exclusively. Never use `npm`.
- **Commits:** Use interactive conventional commits (`feat:`, `fix:`, `docs:`, etc.).

---

## 🚫 10. Prohibited Items

- **No Tailwind CSS:** Project uses vanilla SCSS only.
- **No TypeScript:** This is a pure JavaScript project.

---

## 🏗️ Project Architecture (Current State)

### Tech Stack
- **Framework**: Next.js (App Router)
- **Auth**: NextAuth.js v5 + Firebase Auth (Hybrid)
- **Database**: Firebase (Firestore)

### Recent Implementations
- **Hybrid Auth Flow**: Sign-up via Firebase Client SDK, Sign-in via NextAuth Credentials + Firebase server-side.
- **Token Management**: Firebase ID Token is included in the NextAuth session as `accessToken`.

### Key Files
- `src/auth.js`: NextAuth configuration and callbacks.
- `src/resources/components/login-page/index.jsx`: Auth UI/Logic.
- `src/resources/context/auth-context.js`: Custom Auth context.

_Last updated: 2026-02-14_
