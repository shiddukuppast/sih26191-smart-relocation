import pandas as pd


HAZARD_FEATURES = [
    "rainfall_24h_mm",
    "rainfall_7d_mm",
    "slope_deg",
    "elevation_m",
    "land_use",
    "distance_to_river_m",
    "soil_type",
    "historical_landslide_count",
    "historical_flood_count",
    "built_up_percentage",
]


def prepare_features(features: dict) -> pd.DataFrame:
    """
    Convert extracted hazard features into the DataFrame format
    expected by the trained ML pipeline.
    """

    missing_features = [
        feature for feature in HAZARD_FEATURES
        if feature not in features
    ]

    if missing_features:
        raise ValueError(
            f"Missing hazard features: {missing_features}"
        )

    data = {
        feature: features[feature]
        for feature in HAZARD_FEATURES
    }

    return pd.DataFrame([data], columns=HAZARD_FEATURES)