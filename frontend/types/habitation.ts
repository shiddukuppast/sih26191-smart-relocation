import { HazardLevel, HazardResult } from "./hazard";

export type HabitationStatus = 
  | "Safe" 
  | "Monitoring" 
  | "Priority" 
  | "Immediate" 
  | "Relocation Initiated" 
  | "Relocated";

export type PriorityLevel = "Immediate" | "Critical" | "High" | "Medium" | "Low";

export interface Habitation {
  habitationId: string;
  name: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  housesAffected: number;
  hazard: HazardResult;
  vulnerabilityScore: number; // 0 - 100
  vulnerabilityBreakdown: {
    populationExposure: number;
    housingExposure: number;
    accessibility: number;
    criticalInfrastructure: number;
    hazardSeverity: number;
  };
  relocationPriorityScore: number; // 0 - 100
  relocationPriorityBreakdown: {
    hazardSeverity: number;
    populationExposure: number;
    housingExposure: number;
    accessibilityPenalty: number;
    infrastructureVulnerability: number;
  };
  priorityLevel: PriorityLevel;
  status: HabitationStatus;
  distanceToHazardKm?: number;
  recommendedSiteId?: string;
  lastAssessedAt: string;
}
