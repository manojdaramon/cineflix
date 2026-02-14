import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth as firebaseAuth } from "@/resources/components/firebase/firebase";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        /**
         * Google OAuth Provider
         * Uses Google Cloud OAuth credentials (not Firebase's Google sign-in).
         * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local
         */
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        /**
         * Credentials Provider
         * Validates email/password against Firebase Auth.
         * The authorize() function runs server-side on every sign-in attempt.
         */
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required.");
                }

                try {
                    const userCredential = await signInWithEmailAndPassword(
                        firebaseAuth,
                        credentials.email,
                        credentials.password
                    );

                    const user = userCredential.user;
                    const idToken = await user.getIdToken();

                    // Return user object — this becomes the JWT payload
                    return {
                        id: user.uid,
                        name: user.displayName,
                        email: user.email,
                        accessToken: idToken,
                    };
                } catch (error) {
                    // Return null = failed authentication
                    return null;
                }
            },
        }),
    ],

    /**
     * Session Strategy
     * JWT = no database needed. The session lives in an encrypted cookie.
     */
    session: {
        strategy: "jwt",
    },

    /**
     * Custom Pages
     * Tell NextAuth to use our custom /login page instead of its default UI.
     */
    pages: {
        signIn: "/login",
    },

    /**
     * Callbacks
     * These run during the auth lifecycle to customize tokens and sessions.
     */
    callbacks: {
        /**
         * JWT callback — runs when a JWT is created or updated.
         * Attaches the user's id from the provider to the token.
         */
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                // For Google, account has access_token or id_token
                token.accessToken = account.id_token || account.access_token;
            } else if (user?.accessToken) {
                // For Credentials, we manually added accessToken to the user object
                token.accessToken = user.accessToken;
            }
            return token;
        },

        /**
         * Session callback — runs when session is checked.
         * Attaches the user id from the JWT to the session object,
         * so it's available via useSession() or auth().
         */
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id;
            }
            if (token?.accessToken) {
                session.user.accessToken = token.accessToken;
            }
            return session;
        },

        /**
         * Authorized callback — used by middleware to check auth.
         * Returns true if the user has a valid session.
         */
        async authorized({ auth, request }) {
            const isLoggedIn = !!auth?.user;
            const isOnLogin = request.nextUrl.pathname.startsWith("/login");

            // Already logged in and on login page → redirect to home
            if (isOnLogin && isLoggedIn) {
                return Response.redirect(new URL("/", request.nextUrl));
            }

            // Not logged in and on a protected page → deny (redirects to signIn page)
            if (!isOnLogin && !isLoggedIn) {
                return false;
            }

            return true;
        },
    },
});
