import rasterio
from rasterio.warp import transform


def get_land_use(latitude: float, longitude: float, land_use_path: str) -> int:
    """
    Get the land-use / land-cover class at a latitude/longitude point
    from a raster dataset.
    """

    with rasterio.open(land_use_path) as land_use_raster:

        # Convert WGS84 coordinates to raster CRS
        x, y = transform(
            "EPSG:4326",
            land_use_raster.crs,
            [longitude],
            [latitude]
        )

        # Find raster cell
        row, col = land_use_raster.index(x[0], y[0])

        # Read land-use class
        value = land_use_raster.read(1)[row, col]

        # Handle NoData
        if land_use_raster.nodata is not None and value == land_use_raster.nodata:
            return None

        return int(value)