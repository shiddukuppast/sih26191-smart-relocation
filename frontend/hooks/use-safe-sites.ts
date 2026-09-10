import { useQuery } from "@tanstack/react-query";
import { getSafeSites, getSafeSiteById } from "@/lib/api/sites";

export function useSafeSites() {
  return useQuery({
    queryKey: ["safe-sites"],
    queryFn: () => getSafeSites(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSafeSite(id: string) {
  return useQuery({
    queryKey: ["safe-site", id],
    queryFn: () => getSafeSiteById(id),
    enabled: !!id,
  });
}
