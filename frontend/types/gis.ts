export interface MapLayerVisibility {
  hazardZones: boolean;
  habitations: boolean;
  safeSites: boolean;
  rivers: boolean;
  roads: boolean;
  hospitals: boolean;
  schools: boolean;
  satellite: boolean;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface InfrastructurePoint {
  id: string;
  name: string;
  type: "hospital" | "school" | "river" | "road";
  lat: number;
  lng: number;
  details: string;
}
