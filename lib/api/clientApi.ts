import axios from "axios";
import type { User } from "@/types/user";

const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

export interface AuthPayload {
  email: string;
  password: string;
}

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<User> => {
  const { data } = await clientApi.post("/auth/login", payload);
  return data;
};

export const register = async (payload: AuthPayload): Promise<User> => {
  const { data } = await clientApi.post<User>("/auth/register", payload);
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } = await clientApi.get("/auth/session");
    return !!data;
  } catch (err) {
    if (
      axios.isAxiosError(err) &&
      (err.response?.status === 401 || err.response?.status === 403)
    ) {
      return false;
    }
    return false;
  }
};
