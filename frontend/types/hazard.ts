export type HazardLevel = 0 | 1 | 2 | 3 | 4;

export interface HazardFeatures {
  rainfall_24h_mm: number;
  rainfall_7d_mm: number;
  slope_deg: number;
  elevation_m: number;
  land_use: string;
  distance_to_river_m: number;
  soil_type: string;
  historical_landslide_count: number;
  historical_flood_count: number;
  built_up_percentage: number;
}

export interface HazardPrediction {
  hazard_level: HazardLevel;
  score?: number; // 0 - 100
  level_label?: string; // Safe, Low, Medium, High, Red Zone
}

export interface HazardResult {
  site_id?: string;
  habitation_id?: string;
  latitude: number;
  longitude: number;
  features?: HazardFeatures;
  flood: HazardPrediction;
  landslide: HazardPrediction;
  flood_score?: number;
  flood_level?: string;
  landslide_score?: number;
  landslide_level?: string;
  overall_hazard_score?: number;
  overall_hazard_level?: HazardLevel | string;
}

export interface HazardPredictRequest {
  latitude: number;
  longitude: number;
}
