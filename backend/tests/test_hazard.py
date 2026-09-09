import pandas as pd

from app.services.hazard.feature_extractor import extract_features
from app.services.hazard.preprocessor import prepare_features
from app.services.hazard.predictor import predict_hazard


def test_hazard_prediction():

    # 1. Extract features from a location
    features_dict = extract_features(
        latitude=15.3173,
        longitude=75.7139
    )

    # 2. Check that all required features exist
    assert len(features_dict) == 10

    # 3. Prepare features for the ML models
    features = prepare_features(features_dict)

    assert isinstance(features, pd.DataFrame)
    assert len(features) == 1
    assert len(features.columns) == 10

    # 4. Run both hazard models
    result = predict_hazard(features)

    print("\nHazard Result:")
    print(result)

    assert "flood" in result
    assert "landslide" in result

    assert "hazard_level" in result["flood"]
    assert "hazard_level" in result["landslide"]

    assert result["flood"]["hazard_level"] in [0, 1, 2, 3, 4]
    assert result["landslide"]["hazard_level"] in [0, 1, 2, 3, 4]