import { MOCK_RELOCATION_CASES, MOCK_RECOMMENDATIONS } from "../mock/relocation";
import { RelocationCase, RelocationRecommendation } from "@/types";

export async function getRelocationCases(): Promise<RelocationCase[]> {
  return MOCK_RELOCATION_CASES;
}

export async function getRecommendationForHabitation(habitationId: string): Promise<RelocationRecommendation | null> {
  if (MOCK_RECOMMENDATIONS[habitationId]) {
    return MOCK_RECOMMENDATIONS[habitationId];
  }
  // Generic fallback recommendation if not in explicit map
  return {
    sourceHabitationId: habitationId,
    recommendedSiteId: "SAFE-204",
    recommendedSiteName: "Safe Zone B — Kushalnagar Highland",
    populationToRelocate: 500,
    availableCapacity: 690,
    remainingCapacity: 190,
    distanceKm: 6.2,
    recommendationScore: 88,
    roadAccess: "Good",
    hospitalAccess: "Good",
    schoolAccess: "Good",
    waterAvailability: "Good",
    reasons: [
      "Adequate carrying capacity buffer",
      "Low environmental risk rating (Level 0 Safe Zone)",
      "High road network accessibility for transport convoys",
      "Proximity to primary health facilities"
    ],
  };
}
