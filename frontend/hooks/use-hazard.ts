import { useQuery } from "@tanstack/react-query";
import { predictHazard } from "@/lib/api/hazard";

export function useHazardPrediction(lat: number, lng: number) {
  return useQuery({
    queryKey: ["hazard-prediction", lat, lng],
    queryFn: () => predictHazard(lat, lng),
    enabled: typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng),
  });
}
