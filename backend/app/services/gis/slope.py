import rasterio
from rasterio.warp import transform


def get_slope(latitude: float, longitude: float, slope_path: str):
    """
    Get slope in degrees for a latitude/longitude point
    from a precomputed slope GeoTIFF.
    """

    with rasterio.open(slope_path) as slope_raster:

        # Convert WGS84 coordinates to the raster CRS
        x, y = transform(
            "EPSG:4326",
            slope_raster.crs,
            [longitude],
            [latitude]
        )

        # Sample only the required pixel
        value = next(
            slope_raster.sample([(x[0], y[0])])
        )[0]

        # Handle NoData
        if slope_raster.nodata is not None and value == slope_raster.nodata:
            return None

        return float(value)