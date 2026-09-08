from fastapi import APIRouter, HTTPException

from app.schemas.hazard import HazardRequest
from app.services.hazard.feature_extractor import extract_features
from app.services.hazard.preprocessor import prepare_features
from app.services.hazard.predictor import predict_hazard


router = APIRouter(
    prefix="/api/hazard",
    tags=["Hazard"]
)


@router.post("/predict")
def predict(request: HazardRequest):
    """
    Predict flood and landslide hazard for a given location.
    """

    try:
        # 1. Extract features using latitude and longitude
        features = extract_features(
            request.latitude,
            request.longitude
        )

        # 2. Prepare features for the trained ML pipelines
        prepared_features = prepare_features(features)

        # 3. Run flood and landslide models
        prediction = predict_hazard(prepared_features)

        # 4. Return the complete result
        return {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "features": features,
            **prediction
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )