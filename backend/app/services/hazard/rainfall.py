import os
from typing import Dict

import requests
from dotenv import load_dotenv


load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

OPENWEATHER_WEATHER_URL = (
    "https://api.openweathermap.org/data/2.5/weather"
)


def get_current_rainfall(
    latitude: float,
    longitude: float
) -> float:
    """
    Get the currently reported precipitation from OpenWeather.

    This is being used as a prototype rainfall value.
    It is NOT a 24-hour accumulated rainfall measurement.
    """

    if not OPENWEATHER_API_KEY:
        raise ValueError(
            "OPENWEATHER_API_KEY is not configured in the .env file."
        )

    if not -90 <= latitude <= 90:
        raise ValueError(
            "Latitude must be between -90 and 90."
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            "Longitude must be between -180 and 180."
        )

    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": OPENWEATHER_API_KEY,
        "units": "metric"
    }

    response = requests.get(
        OPENWEATHER_WEATHER_URL,
        params=params,
        timeout=15
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"OpenWeather API request failed "
            f"with status {response.status_code}: "
            f"{response.text}"
        )

    data = response.json()

    # OpenWeather only includes "rain" when rain is reported.
    # If there is no rain field, we treat it as 0 mm
    # for this prototype.
    rainfall = 0.0

    if "rain" in data:

        if "1h" in data["rain"]:
            rainfall = float(data["rain"]["1h"])

        elif "3h" in data["rain"]:
            rainfall = float(data["rain"]["3h"]) / 3.0

    return rainfall


def get_rainfall_features(
    latitude: float,
    longitude: float
) -> Dict[str, float]:
    """
    Return rainfall features required by the ML model.

    Prototype:
        rainfall_24h_mm -> OpenWeather current rainfall value
        rainfall_7d_mm  -> temporary sample value

    The 24-hour and 7-day calculations will be replaced
    with proper accumulated rainfall data later.
    """

    rainfall_24h = get_current_rainfall(
        latitude,
        longitude
    )

    return {
        "rainfall_24h_mm": rainfall_24h,
        "rainfall_7d_mm": 350.0
    }