import pandas as pd

from app.services.hazard.preprocessor import prepare_features
from app.services.hazard.predictor import predict_hazard


def test_hazard_prediction():
    """
    Test both flood and landslide models using sample hazard features.
    """

    sample_features = {
        "rainfall_24h_mm": 120.0,
        "rainfall_7d_mm": 350.0,
        "slope_deg": 25.0,
        "elevation_m": 800.0,
        "land_use": "forest",
        "distance_to_river_m": 500.0,
        "soil_type": "clay",
        "historical_landslide_count": 4,
        "historical_flood_count": 3,
        "built_up_percentage": 35.0
    }

    # Prepare features
    features = prepare_features(sample_features)

    # Verify DataFrame structure
    assert isinstance(features, pd.DataFrame)
    assert len(features) == 1
    assert len(features.columns) == 10

    # Run both models
    result = predict_hazard(features)

    # Verify response structure
    assert "flood" in result
    assert "landslide" in result

    assert "hazard_level" in result["flood"]
    assert "hazard_level" in result["landslide"]

    # Verify predicted classes
    assert result["flood"]["hazard_level"] in [0, 1, 2, 3, 4]
    assert result["landslide"]["hazard_level"] in [0, 1, 2, 3, 4]