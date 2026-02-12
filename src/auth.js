import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null

                // MOCK USER for testing
                // You can replace this with a database call
                // User: user@cineflix.com
                // Pass: password
                if (credentials.email === "user@cineflix.com" && credentials.password === "password") {
                    user = {
                        id: "1",
                        name: "Cineflix User",
                        email: "user@cineflix.com",
                    }
                    return user
                }

                // Return null if user data could not be retrieved
                return null
            },
        }),
    ],
    secret: "some-secret-key-at-least-32-chars-long",
    pages: {
        signIn: '/login',
    }
})
