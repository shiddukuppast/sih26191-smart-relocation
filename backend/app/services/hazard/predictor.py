from pathlib import Path

import joblib
import pandas as pd


# Path to the directory containing the trained models
MODEL_DIR = Path(__file__).resolve().parents[2] / "ml" / "hazard"


# Load trained models once when the application starts
FLOOD_MODEL_PATH = MODEL_DIR / "flood_model.pkl"
LANDSLIDE_MODEL_PATH = MODEL_DIR / "landslide_model.pkl"


if not FLOOD_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Flood model not found: {FLOOD_MODEL_PATH}"
    )

if not LANDSLIDE_MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Landslide model not found: {LANDSLIDE_MODEL_PATH}"
    )


flood_model = joblib.load(FLOOD_MODEL_PATH)
landslide_model = joblib.load(LANDSLIDE_MODEL_PATH)


def predict_hazard(features: pd.DataFrame) -> dict:
    """
    Run both flood and landslide models using the prepared features.
    """

    flood_prediction = flood_model.predict(features)[0]
    landslide_prediction = landslide_model.predict(features)[0]

    result = {
        "flood": {
            "hazard_level": int(flood_prediction)
        },
        "landslide": {
            "hazard_level": int(landslide_prediction)
        }
    }

    return result