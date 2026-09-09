import math

import rasterio
from rasterio.windows import Window


WORLD_COVER_MAPPING = {
    10: "Forest",
    20: "Forest",
    30: "Grassland",
    40: "Agricultural",
    50: "Built-up",
    60: "Bare land",
    80: "Water",
    90: "Wetland",
    95: "Wetland",
    100: "Forest",
}


WORLD_COVER_BASE_URL = (
    "https://esa-worldcover.s3.eu-central-1.amazonaws.com/"
    "v200/2021/map"
)


def map_worldcover_class(worldcover_class: int) -> str:
    """
    Convert an ESA WorldCover class code into the
    land-use category expected by the trained ML model.
    """

    if worldcover_class not in WORLD_COVER_MAPPING:
        raise ValueError(
            f"Unsupported WorldCover class: {worldcover_class}"
        )

    return WORLD_COVER_MAPPING[worldcover_class]


def get_worldcover_tile(latitude: float, longitude: float) -> str:
    """
    Determine the 3° x 3° ESA WorldCover tile containing
    the requested coordinate.
    """

    if not -90 <= latitude <= 90:
        raise ValueError(
            "Latitude must be between -90 and 90."
        )

    if not -180 <= longitude <= 180:
        raise ValueError(
            "Longitude must be between -180 and 180."
        )

    lat_tile = math.floor(latitude / 3) * 3
    lon_tile = math.floor(longitude / 3) * 3

    lat_direction = "N" if lat_tile >= 0 else "S"
    lon_direction = "E" if lon_tile >= 0 else "W"

    lat_value = abs(lat_tile)
    lon_value = abs(lon_tile)

    return (
        f"{lat_direction}{lat_value:02d}"
        f"{lon_direction}{lon_value:03d}"
    )


def get_land_use(
    latitude: float,
    longitude: float
) -> str:
    """
    Get the land-use category for a geographic location
    using ESA WorldCover 2021.

    The WorldCover raster is accessed as a Cloud-Optimized
    GeoTIFF and only the required pixel is read.
    """

    tile = get_worldcover_tile(
        latitude,
        longitude
    )

    filename = (
        f"ESA_WorldCover_10m_2021_v200_"
        f"{tile}_Map.tif"
    )

    url = (
        f"{WORLD_COVER_BASE_URL}/"
        f"{filename}"
    )

    try:
        with rasterio.open(url) as dataset:

            row, column = dataset.index(
                longitude,
                latitude
            )

            window = Window(
                column,
                row,
                1,
                1
            )

            data = dataset.read(
                1,
                window=window
            )

    except Exception as e:
        raise RuntimeError(
            f"Failed to retrieve WorldCover data "
            f"for ({latitude}, {longitude}): {e}"
        )

    if data.size == 0:
        raise RuntimeError(
            "No WorldCover pixel found for the location."
        )

    worldcover_class = int(data[0, 0])

    return map_worldcover_class(
        worldcover_class
    )