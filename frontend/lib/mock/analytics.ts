export const MOCK_HAZARD_TRENDS = [
  { time: "00:00", floodRisk: 42, landslideRisk: 38, avgRainfall: 15 },
  { time: "04:00", floodRisk: 48, landslideRisk: 44, avgRainfall: 28 },
  { time: "08:00", floodRisk: 58, landslideRisk: 52, avgRainfall: 52 },
  { time: "12:00", floodRisk: 68, landslideRisk: 59, avgRainfall: 85 },
  { time: "16:00", floodRisk: 79, landslideRisk: 64, avgRainfall: 120 },
  { time: "20:00", floodRisk: 84, landslideRisk: 72, avgRainfall: 148 },
];

export const MOCK_POPULATION_BY_HAZARD = [
  { name: "Red Zone", population: 14200, habitations: 37, fill: "#e11d48" },
  { name: "High", population: 21400, habitations: 82, fill: "#f97316" },
  { name: "Medium", population: 9800, habitations: 64, fill: "#f59e0b" },
  { name: "Low", population: 3220, habitations: 35, fill: "#06b6d4" },
];

export const MOCK_RELOCATION_STATS = {
  identified: 128,
  approved: 84,
  inProgress: 32,
  completed: 18,
};
