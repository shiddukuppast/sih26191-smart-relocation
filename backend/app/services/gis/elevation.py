import rasterio
from rasterio.warp import transform


def get_elevation(latitude: float, longitude: float, dem_path: str):
    """
    Get elevation in meters for a latitude/longitude point
    from a DEM GeoTIFF.
    """

    with rasterio.open(dem_path) as dem:

        # Convert WGS84 coordinates to DEM CRS
        x, y = transform(
            "EPSG:4326",
            dem.crs,
            [longitude],
            [latitude]
        )

        # Sample only the required pixel
        value = next(dem.sample([(x[0], y[0])]))[0]

        # Handle NoData
        if dem.nodata is not None and value == dem.nodata:
            return None

        return float(value)