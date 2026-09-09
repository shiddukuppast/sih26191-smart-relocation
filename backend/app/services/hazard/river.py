import math

import requests


OVERPASS_URL = "https://overpass-api.de/api/interpreter"

HEADERS = {
    "User-Agent": "SIH26191-Smart-Relocation/1.0"
}


def haversine_distance(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float
) -> float:
    """
    Calculate the distance between two geographic coordinates.

    Returns:
        Distance in meters.
    """

    earth_radius = 6371000

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius * c


def get_distance_to_river(
    latitude: float,
    longitude: float,
    radius: int = 5000
) -> float:
    """
    Find nearby rivers, streams, or canals using
    OpenStreetMap Overpass API.

    Returns:
        Approximate distance to the nearest mapped
        waterway in meters.
    """

    if not -90 <= latitude <= 90:
        raise ValueError(
            "Latitude must be between -90 and 90."
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            "Longitude must be between -180 and 180."
        )

    query = f"""
    [out:json][timeout:30];

    way["waterway"~"river|stream|canal"]
    (around:{radius},{latitude},{longitude});

    out geom;
    """

    response = requests.get(
        OVERPASS_URL,
        params={"data": query},
        headers=HEADERS,
        timeout=45
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"Overpass API request failed "
            f"with status {response.status_code}: "
            f"{response.text}"
        )

    data = response.json()

    elements = data.get("elements", [])

    if not elements:
        raise RuntimeError(
            f"No waterways found within {radius} meters "
            f"of ({latitude}, {longitude})."
        )

    nearest_distance = float("inf")

    for element in elements:

        geometry = element.get("geometry", [])

        for point in geometry:

            point_latitude = point.get("lat")
            point_longitude = point.get("lon")

            if (
                point_latitude is None
                or point_longitude is None
            ):
                continue

            distance = haversine_distance(
                latitude,
                longitude,
                point_latitude,
                point_longitude
            )

            if distance < nearest_distance:
                nearest_distance = distance

    if nearest_distance == float("inf"):
        raise RuntimeError(
            "Could not calculate distance to nearby waterways."
        )

    return float(nearest_distance)