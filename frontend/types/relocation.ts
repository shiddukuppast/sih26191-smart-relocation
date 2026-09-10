export type RelocationStatus = "Pending" | "Approved" | "In Progress" | "Completed";

export interface RelocationCase {
  caseId: string;
  sourceHabitationId: string;
  sourceHabitationName: string;
  district: string;
  population: number;
  priorityScore: number;
  priorityLevel: string;
  recommendedSiteId: string;
  recommendedSiteName: string;
  distanceKm: number;
  status: RelocationStatus;
  requestedAt: string;
  updatedAt: string;
  assignedOfficer?: string;
  notes?: string;
}

export interface RelocationRecommendation {
  sourceHabitationId: string;
  sourceHabitationName?: string;
  recommendedSiteId: string;
  recommendedSiteName: string;
  populationToRelocate: number;
  availableCapacity: number;
  remainingCapacity: number;
  distanceKm: number;
  recommendationScore: number;
  roadAccess: string;
  hospitalAccess: string;
  schoolAccess: string;
  waterAvailability: string;
  reasons: string[];
}
