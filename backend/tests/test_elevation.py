from app.services.hazard.elevation import get_elevation


def test_elevation_api():

    latitude = 15.3173
    longitude = 75.7139

    elevation = get_elevation(
        latitude,
        longitude
    )

    print("\nElevation Result:")
    print(elevation)

    assert isinstance(elevation, float)