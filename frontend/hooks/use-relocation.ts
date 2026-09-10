import { useQuery } from "@tanstack/react-query";
import { getRelocationCases, getRecommendationForHabitation } from "@/lib/api/relocation";

export function useRelocationCases() {
  return useQuery({
    queryKey: ["relocation-cases"],
    queryFn: () => getRelocationCases(),
  });
}

export function useRelocationRecommendation(habitationId: string) {
  return useQuery({
    queryKey: ["relocation-recommendation", habitationId],
    queryFn: () => getRecommendationForHabitation(habitationId),
    enabled: !!habitationId,
  });
}
