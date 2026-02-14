import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "./styles/globals.scss";
import { AuthProvider } from "@/resources/context/auth-context";
import QueryProvider from "@/resources/context/query-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Cineflix",
  description: "Netflix Clone",
};

/**
 * RootLayout
 *
 * SessionProvider  — NextAuth's React context (provides useSession)
 *   └─ QueryProvider — TanStack Query cache (provides useQuery / useMutation)
 *       └─ AuthProvider — our custom context (provides useAuth)
 *
 * SessionProvider MUST wrap AuthProvider because AuthProvider calls useSession().
 * QueryProvider sits in between so queries can access the session if needed.
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <SessionProvider>
          <QueryProvider>
            <AuthProvider>
              <div className="cf_app_container">
                {children}
              </div>
            </AuthProvider>
          </QueryProvider>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
