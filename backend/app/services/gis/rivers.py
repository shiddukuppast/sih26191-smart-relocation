import geopandas as gpd
from shapely.geometry import Point


def get_distance_to_river(
    latitude: float,
    longitude: float,
    rivers_path: str
) -> float:
    """
    Calculate the distance from a location to the nearest river.

    Returns distance in kilometers.
    """

    # Create point from latitude/longitude
    point = gpd.GeoDataFrame(
        {"geometry": [Point(longitude, latitude)]},
        crs="EPSG:4326"
    )

    # Load river data
    rivers = gpd.read_file(rivers_path)

    if rivers.empty:
        raise ValueError("River dataset is empty.")

    # Reproject both to a metric CRS
    point = point.to_crs("EPSG:32644")
    rivers = rivers.to_crs("EPSG:32644")

    # Calculate nearest distance in meters
    distance_m = rivers.geometry.distance(point.geometry.iloc[0]).min()

    # Convert meters → kilometers
    return float(distance_m / 1000)