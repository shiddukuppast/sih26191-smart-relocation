import { HazardLevel } from "./hazard";

export type InfrastructureRating = "Good" | "Moderate" | "Limited" | "Poor";

export interface SafeSite {
  siteId: string;
  name: string;
  location: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  currentPopulation: number;
  availableCapacity: number;
  waterAvailability: InfrastructureRating;
  roadAccess: InfrastructureRating;
  hospitalAccess: InfrastructureRating;
  schoolAccess: InfrastructureRating;
  electricityStatus: InfrastructureRating;
  emergencyAccess: InfrastructureRating;
  recommendationScore: number; // 0 - 100
  hazardLevel: HazardLevel;
  elevationM: number;
  landAreaHectares: number;
  assignedHabitationIds?: string[];
}
