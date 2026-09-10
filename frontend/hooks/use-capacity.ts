import { useQuery } from "@tanstack/react-query";
import { getCarryingCapacity } from "@/lib/api/capacity";

export function useCarryingCapacity() {
  return useQuery({
    queryKey: ["carrying-capacity"],
    queryFn: () => getCarryingCapacity(),
  });
}
