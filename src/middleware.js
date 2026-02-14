/**
 * NextAuth.js Middleware
 *
 * This runs BEFORE every matched request.
 * It checks the session cookie and decides whether to allow or redirect.
 * The actual logic lives in the `authorized` callback in auth.js.
 */
export { auth as middleware } from "@/auth";

/**
 * Matcher config — tells Next.js which routes this middleware applies to.
 * We exclude:
 *  - /api/auth/* (NextAuth's own endpoints — must be public)
 *  - /_next/*     (Next.js internals)
 *  - /favicon.ico, images, etc.
 */
export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$).*)",
    ],
};
