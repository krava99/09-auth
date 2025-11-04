import axios from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams,
  cookies?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const { data } = await serverApi.get("/notes", {
    params,
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const fetchNoteById = async (
  id: string,
  cookies?: string
): Promise<Note> => {
  const { data } = await serverApi.get(`/notes/${id}`, {
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const createNote = async (
  note: { title: string; content: string; tag: NoteTag },
  cookies?: string
): Promise<Note> => {
  const { data } = await serverApi.post("/notes", note, {
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const deleteNote = async (
  id: string,
  cookies?: string
): Promise<Note> => {
  const { data } = await serverApi.delete(`/notes/${id}`, {
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const getMe = async (cookies?: string): Promise<User> => {
  const { data } = await serverApi.get("/users/me", {
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const updateMe = async (
  payload: { username?: string; avatar?: string },
  cookies?: string
): Promise<User> => {
  const { data } = await serverApi.patch("/users/me", payload, {
    headers: cookies ? { Cookie: cookies } : undefined,
  });
  return data;
};

export const refreshSession = async (
  refreshToken: string
): Promise<{
  newAccessToken: string;
  newRefreshToken: string;
}> => {
  const { data } = await serverApi.post("/auth/refresh", { refreshToken });
  return data;
};
