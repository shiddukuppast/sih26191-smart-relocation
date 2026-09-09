import os

import requests
from dotenv import load_dotenv


load_dotenv()

OPENTOPOGRAPHY_API_KEY = os.getenv("OPENTOPOGRAPHY_API_KEY")

OPENTOPOGRAPHY_ELEVATION_URL = (
    "https://portal.opentopography.org/API/v1/elevation"
)


def get_elevation(
    latitude: float,
    longitude: float
) -> float:
    """
    Get elevation in meters for a geographic location
    using OpenTopography's Point Elevation API.

    Dataset:
        COP30 - Copernicus Global DSM, approximately 30 m.
    """

    if not OPENTOPOGRAPHY_API_KEY:
        raise ValueError(
            "OPENTOPOGRAPHY_API_KEY is not configured "
            "in the .env file."
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
        "latitude": latitude,
        "longitude": longitude,
        "dataset": "COP30",
        "API_Key": OPENTOPOGRAPHY_API_KEY
    }

    response = requests.get(
        OPENTOPOGRAPHY_ELEVATION_URL,
        params=params,
        timeout=15
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"OpenTopography API request failed "
            f"with status {response.status_code}: "
            f"{response.text}"
        )

    data = response.json()

    # The Point Elevation API returns the elevation
    # in the response's elevation field.
    if "Elevation" not in data:
        raise RuntimeError(
            f"Elevation not found in OpenTopography response: "
            f"{data}"
        )

    return float(data["Elevation"])