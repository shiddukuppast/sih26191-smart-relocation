from typing import Dict

from app.services.hazard.rainfall import get_rainfall_features
from app.services.hazard.elevation import get_elevation
from app.services.hazard.river import get_distance_to_river
from app.services.hazard.land_use import get_land_use


def extract_features(latitude: float, longitude: float) -> Dict:
    """
    Extract hazard-related features for a given geographic location.

    Currently:
    - Rainfall is obtained from OpenWeather.
    - Other features use temporary sample values.

    Real data sources for the remaining features will be
    integrated later.
    """

    # Validate latitude
    if not -90 <= latitude <= 90:
        raise ValueError(
            f"Invalid latitude: {latitude}. "
            "Latitude must be between -90 and 90."
        )

    # Validate longitude
    if not -180 <= longitude <= 180:
        raise ValueError(
            f"Invalid longitude: {longitude}. "
            "Longitude must be between -180 and 180."
        )

    # Get rainfall from OpenWeather
    rainfall_features = get_rainfall_features(
        latitude,
        longitude
    )

    elevation = get_elevation(
        latitude,
        longitude
    )

    distance_to_river = get_distance_to_river(
        latitude,
        longitude
    )
    land_use = get_land_use(
        latitude,
        longitude
    )
    # Temporary values for features
    # that will be replaced with real data later.
    features = {
        "rainfall_24h_mm": rainfall_features["rainfall_24h_mm"],
        "rainfall_7d_mm": rainfall_features["rainfall_7d_mm"],

        "slope_deg": 25.0,
        "elevation_m":elevation,
        "land_use": land_use,
        "distance_to_river_m": distance_to_river,
        "soil_type": "clay",
        "historical_landslide_count": 4,
        "historical_flood_count": 3,
        "built_up_percentage": 35.0
    }

    return features