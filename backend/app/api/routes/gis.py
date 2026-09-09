from fastapi import APIRouter, Query

from app.services.gis.elevation import get_elevation
from app.services.gis.slope import get_slope


router = APIRouter(
    prefix="/gis",
    tags=["GIS"]
)


@router.get("/terrain")
def get_terrain(
    latitude: float = Query(...),
    longitude: float = Query(...),
    dem_path: str = Query(...),
    slope_path: str = Query(...)
):
    """
    Get terrain features for a latitude/longitude location.
    """

    elevation = get_elevation(
        latitude,
        longitude,
        dem_path
    )

    slope = get_slope(
        latitude,
        longitude,
        slope_path
    )

    return {
        "latitude": latitude,
        "longitude": longitude,
        "elevation_m": elevation,
        "slope_deg": slope
    }