import useSWR from "swr";

export function useNotes() {
  return useSWR(
    "/api/notes",
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch notes");
      return response.json();
    },
    { revalidateOnFocus: true, revalidateOnReconnect: true }
  );
}
