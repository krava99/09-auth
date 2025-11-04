import api from "./api";
import type { Note } from "@/types/note";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

// Отримати нотатки
export const fetchNotes = async (
  { page = 1, perPage = 12, search, tag }: FetchNotesParams,
  cookies: string
): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage };
  if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookies },
  });

  return data;
};

// Отримати одну нотатку
export const fetchNoteById = async (
  id: string,
  cookies: string
): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookies },
  });
  return data;
};

// ✅ Отримати дані поточного користувача
export const getServerUser = async (cookies: string) => {
  const { data } = await api.get("/users/current", {
    headers: { Cookie: cookies },
  });
  return data;
};

// ✅ Перевірити сесію
export const checkSession = async (cookies: string) => {
  const { data } = await api.get("/auth/refresh", {
    headers: { Cookie: cookies },
  });
  return data;
};
