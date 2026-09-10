import { MOCK_CAPACITY_SUMMARY } from "../mock/capacity";
import { CarryingCapacitySummary } from "@/types";

export async function getCarryingCapacity(): Promise<CarryingCapacitySummary> {
  return MOCK_CAPACITY_SUMMARY;
}
