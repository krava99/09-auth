"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  loginUser: (userData: User) => void;
  logoutUser: () => Promise<void>;
  registerUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const loginUser = (userData: User) => setUser(userData);
  const registerUser = (userData: User) => setUser(userData);
  const logoutUser = async () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
