import { useQuery } from "@tanstack/react-query";
import { getHabitations, getHabitationById } from "@/lib/api/habitations";

export function useHabitations() {
  return useQuery({
    queryKey: ["habitations"],
    queryFn: () => getHabitations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useHabitation(id: string) {
  return useQuery({
    queryKey: ["habitation", id],
    queryFn: () => getHabitationById(id),
    enabled: !!id,
  });
}
