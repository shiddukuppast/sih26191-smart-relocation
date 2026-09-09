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

    try:
        # Extract features from location
        features = extract_features(
            request.latitude,
            request.longitude
        )

        # Prepare features for ML models
        prepared_features = prepare_features(features)

        # Predict flood and landslide hazards
        prediction = predict_hazard(prepared_features)

        return {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "features": features,
            **prediction
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Hazard prediction failed."
        )