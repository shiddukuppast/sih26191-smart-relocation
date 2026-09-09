from app.services.hazard.river import get_distance_to_river


def test_river_distance():

    latitude = 15.3173
    longitude = 75.7139

    distance = get_distance_to_river(
        latitude,
        longitude
    )

    print("\nDistance to River/Waterway:")
    print(distance, "meters")

    assert isinstance(distance, float)
    assert distance >= 0