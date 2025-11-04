"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkSession } from "@/lib/api/clientApi";

type Props = {
  children: React.ReactNode;
};

export default function PublicLayout({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const isAuthenticated = await checkSession();
        if (isAuthenticated) {
          setIsAuthenticated(true);
          router.replace("/profile");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      } finally {
        setChecking(false);
      }
    };

    verify();
  }, [router]);

  if (checking) return <>Checking session...</>;

  if (isAuthenticated) return null;

  return <>{children}</>;
}
