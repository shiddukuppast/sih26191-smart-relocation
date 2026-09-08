from typing import Dict


def extract_features(latitude: float, longitude: float) -> Dict:
    """
    Extract all features required by the flood and landslide models
    for a given geographic location.

    External GIS/weather APIs will be integrated here later.
    """

    features = {
        "rainfall_24h_mm": None,
        "rainfall_7d_mm": None,
        "slope_deg": None,
        "elevation_m": None,
        "land_use": None,
        "distance_to_river_m": None,
        "soil_type": None,
        "historical_landslide_count": None,
        "historical_flood_count": None,
        "built_up_percentage": None,
    }

    return features