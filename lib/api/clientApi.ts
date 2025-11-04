import axios from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import api from "./api";

export interface FetchNotesParams {
  page: number;
  search?: string;
  perPage: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage };
  if (search) params.search = search;
  if (tag && tag !== "all") params.tag = tag;

  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (newNote: CreateNotePayload): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", newNote);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export interface AuthPayload {
  email: string;
  password: string;
}

export const register = async (payload: AuthPayload): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
};

export const login = async (payload: AuthPayload): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const data = await getMe();
    return !!data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      return false;
    }

    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.post<User>("/users/me", {});
  return data;
};

export const updateMe = async (payload: {
  username?: string;
  avatar?: string;
}): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
};
