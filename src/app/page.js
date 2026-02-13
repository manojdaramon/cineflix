"use client";

import { useAuth } from "@/resources/context/auth-context";
import Login from "@/resources/components/login-page";
import HomePage from "@/resources/components/home-page";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? <HomePage /> : <Login />;
}
