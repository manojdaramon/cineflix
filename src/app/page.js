import { auth, signOut } from "@/auth";
import Link from "next/link";
import styles from "./page.module.css";

export default async function Home() {
  const session = await auth();

  return (
    <p>hello</p>

  );
}
