import HomePage from "@/resources/components/home-page";

/**
 * Home page — server component.
 *
 * The middleware already ensures only authenticated users can reach this page.
 * HomePage is a "use client" component that reads user info from useAuth() context,
 * so we just render it here — no need to pass props.
 */
export default function Home() {
  return <HomePage />;
}
