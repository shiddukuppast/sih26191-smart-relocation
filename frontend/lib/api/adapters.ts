import { HazardLevel, HazardResult, HazardPrediction } from "@/types";

/**
 * Normalizes diverse backend hazard responses into a clean unified frontend interface.
 * Supports:
 * 1. Current raw Member 2 response: { flood: { hazard_level: 0-4 }, landslide: { hazard_level: 0-4 } }
 * 2. Future enriched response: { flood_score, flood_level, overall_hazard_score, ... }
 */
export function normalizeHazardResponse(raw: any, lat?: number, lng?: number): HazardResult {
  if (!raw) {
    return {
      latitude: lat || 0,
      longitude: lng || 0,
      flood: { hazard_level: 0, score: 0, level_label: "Safe" },
      landslide: { hazard_level: 0, score: 0, level_label: "Safe" },
      overall_hazard_level: 0,
      overall_hazard_score: 0,
    };
  }

  const floodRawLevel = raw.flood?.hazard_level ?? raw.flood_level_num ?? 0;
  const landslideRawLevel = raw.landslide?.hazard_level ?? raw.landslide_level_num ?? 0;

  const floodLevel = Math.max(0, Math.min(4, Number(floodRawLevel))) as HazardLevel;
  const landslideLevel = Math.max(0, Math.min(4, Number(landslideRawLevel))) as HazardLevel;

  // Calculate or read score
  const floodScore = raw.flood_score ?? raw.flood?.score ?? (floodLevel * 25);
  const landslideScore = raw.landslide_score ?? raw.landslide?.score ?? (landslideLevel * 25);

  const overallHazardScore = raw.overall_hazard_score ?? Math.max(floodScore, landslideScore);
  const overallHazardLevel = raw.overall_hazard_level ?? Math.max(floodLevel, landslideLevel);

  const floodPred: HazardPrediction = {
    hazard_level: floodLevel,
    score: floodScore,
    level_label: raw.flood_level || getLevelString(floodLevel),
  };

  const landslidePred: HazardPrediction = {
    hazard_level: landslideLevel,
    score: landslideScore,
    level_label: raw.landslide_level || getLevelString(landslideLevel),
  };

  return {
    site_id: raw.site_id || raw.habitation_id,
    latitude: raw.latitude ?? lat ?? 0,
    longitude: raw.longitude ?? lng ?? 0,
    features: raw.features,
    flood: floodPred,
    landslide: landslidePred,
    flood_score: floodScore,
    flood_level: raw.flood_level || getLevelString(floodLevel),
    landslide_score: landslideScore,
    landslide_level: raw.landslide_level || getLevelString(landslideLevel),
    overall_hazard_score: overallHazardScore,
    overall_hazard_level: overallHazardLevel,
  };
}

function getLevelString(level: HazardLevel): string {
  switch (level) {
    case 4: return "Red Zone";
    case 3: return "High";
    case 2: return "Medium";
    case 1: return "Low";
    case 0:
    default: return "Safe";
  }
}
