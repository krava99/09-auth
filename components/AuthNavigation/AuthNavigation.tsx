"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import css from "./AuthNavigation.module.css";

export default function AuthNavigation() {
  const { user, loading, logoutUser } = useAuth();

  const isAuthenticated = !!user;

  const handleLogout = async () => {
    await logoutUser();
  };

  if (loading) {
    return null;
  }

  return (
    <ul>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <p className={css.userEmail}>{user?.email}</p>
            <button className={css.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
