import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import "./styles/globals.scss";
import { AuthProvider } from "@/resources/context/auth-context";

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
 *   └─ AuthProvider — our custom context (provides useAuth)
 *
 * SessionProvider MUST wrap AuthProvider because AuthProvider calls useSession().
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="top-center" />
        </SessionProvider>
      </body>
    </html>
  );
}
