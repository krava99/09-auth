"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import css from "./EditProfile.module.css";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    username: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
        setUsername(me.username);
      } catch (error) {
        console.error("Failed to load user data:", error);
        router.push("/sign-in");
      }
    };
    fetchUser();
  }, [router]);

  const mutation = useMutation({
    mutationFn: (newData: { username: string }) => updateMe(newData),
    onSuccess: () => {
      router.push("/profile");
    },
    onError: (err) => {
      console.error("Update failed:", err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username });
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  if (!user) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form onSubmit={handleSubmit} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={css.input}
              required
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
