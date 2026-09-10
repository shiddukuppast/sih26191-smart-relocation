import { apiClient, IS_MOCK_MODE } from "./client";
import { normalizeHazardResponse } from "./adapters";
import { HazardResult } from "@/types";

export async function predictHazard(latitude: number, longitude: number): Promise<HazardResult> {
  if (IS_MOCK_MODE) {
    // Generate realistic simulated prediction based on coordinates
    const syntheticRaw = {
      latitude,
      longitude,
      features: {
        rainfall_24h_mm: 135.2,
        rainfall_7d_mm: 380.5,
        slope_deg: 24.5,
        elevation_m: 850.0,
        land_use: "slope_agriculture",
        distance_to_river_m: 210.0,
        soil_type: "clayey_loam",
        historical_landslide_count: 4,
        historical_flood_count: 3,
        built_up_percentage: 38.5,
      },
      flood: { hazard_level: 3 },
      landslide: { hazard_level: 3 },
    };
    return normalizeHazardResponse(syntheticRaw, latitude, longitude);
  }

  try {
    const raw = await apiClient<any>("/api/hazard/predict", {
      method: "POST",
      body: JSON.stringify({ latitude, longitude }),
    });
    return normalizeHazardResponse(raw, latitude, longitude);
  } catch (err) {
    console.warn("Live hazard API request failed, falling back to normalized simulation:", err);
    return normalizeHazardResponse(null, latitude, longitude);
  }
}
