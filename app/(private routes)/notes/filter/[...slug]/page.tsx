import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import type { FetchNotesParams } from "@/types/note";
import NotesClient from "./Notes.client";

type Params = { slug: string[] };

export default async function FilteredNotesPage({
  params,
}: {
  params: Params;
}) {
  const filterSlug = params.slug?.[0] || "all";
  const tagToFetch = filterSlug === "all" ? undefined : filterSlug;

  const fetchParams: FetchNotesParams = {
    page: 1,
    perPage: 12,
    search: "",
    tag: tagToFetch,
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", { ...fetchParams }],
    queryFn: () => fetchNotes(fetchParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={(tagToFetch ?? "all") as "all"} />
    </HydrationBoundary>
  );
}
