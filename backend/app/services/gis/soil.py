import rasterio
from rasterio.warp import transform


def get_soil_value(latitude: float, longitude: float, soil_path: str) -> float:
    """
    Get soil-related raster value for a latitude/longitude point.
    
    The raster can represent soil moisture or another
    soil property depending on the dataset used.
    """

    with rasterio.open(soil_path) as soil_raster:

        # Convert WGS84 coordinates to raster CRS
        x, y = transform(
            "EPSG:4326",
            soil_raster.crs,
            [longitude],
            [latitude]
        )

        # Find raster cell
        row, col = soil_raster.index(x[0], y[0])

        # Read value
        value = soil_raster.read(1)[row, col]

        # Handle NoData
        if soil_raster.nodata is not None and value == soil_raster.nodata:
            return None

        return float(value)