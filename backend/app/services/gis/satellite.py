import rasterio
from rasterio.warp import transform


def get_satellite_value(
    latitude: float,
    longitude: float,
    satellite_path: str
) -> float:
    """
    Get a satellite raster value at a given latitude/longitude.

    The raster may contain a satellite-derived index such as
    NDVI or another spectral/environmental variable.
    """

    with rasterio.open(satellite_path) as satellite:

        # Convert WGS84 coordinates to the raster CRS
        x, y = transform(
            "EPSG:4326",
            satellite.crs,
            [longitude],
            [latitude]
        )

        # Find the corresponding raster cell
        row, col = satellite.index(x[0], y[0])

        # Read the first raster band
        value = satellite.read(1)[row, col]

        # Handle NoData
        if satellite.nodata is not None and value == satellite.nodata:
            return None

        return float(value)