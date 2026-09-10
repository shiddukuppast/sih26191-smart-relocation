export interface DistrictCapacity {
  district: string;
  totalCapacity: number;
  occupiedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
}

export interface SiteCapacityItem {
  siteId: string;
  name: string;
  district: string;
  totalCapacity: number;
  currentPopulation: number;
  availableCapacity: number;
  utilizationPercentage: number;
}

export interface CarryingCapacitySummary {
  totalCapacity: number;
  currentOccupancy: number;
  availableCapacity: number;
  utilizationPercentage: number;
  districtBreakdown: DistrictCapacity[];
  siteBreakdown: SiteCapacityItem[];
}
