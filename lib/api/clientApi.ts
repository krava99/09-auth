import axios from "axios";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

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
  const { data } = await api.post<User>("/users/signup", payload);
  return data;
};

export const login = async (payload: AuthPayload): Promise<User> => {
  const { data } = await api.post<User>("/users/signin", payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/users/signout");
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } = await api.get("/users/me");
    return !!data;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 || error.response?.status === 403)
    ) {
      console.log("Session not valid (401/403).");
      return false;
    }
    console.error("Unknown error during session check:", error);
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (payload: {
  username?: string;
  avatar?: string;
}): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
};
