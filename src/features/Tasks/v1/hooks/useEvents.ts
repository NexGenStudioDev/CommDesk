import { useQuery } from "@tanstack/react-query";
import { mockEvents } from "../mock/taskMockData";
import type { EventOption } from "../Task.types";

const fetchEvents = async (): Promise<EventOption[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return mockEvents;
};

export function useEvents() {
  return useQuery<EventOption[]>({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 5 * 60 * 1000,
  });
}