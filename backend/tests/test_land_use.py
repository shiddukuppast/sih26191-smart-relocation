from app.services.hazard.land_use import (
    get_land_use,
    get_worldcover_tile,
    map_worldcover_class,
)


def test_worldcover_mapping():

    assert map_worldcover_class(10) == "Forest"
    assert map_worldcover_class(20) == "Forest"
    assert map_worldcover_class(30) == "Grassland"
    assert map_worldcover_class(40) == "Agricultural"
    assert map_worldcover_class(50) == "Built-up"
    assert map_worldcover_class(60) == "Bare land"
    assert map_worldcover_class(80) == "Water"
    assert map_worldcover_class(90) == "Wetland"
    assert map_worldcover_class(95) == "Wetland"
    assert map_worldcover_class(100) == "Forest"


def test_worldcover_tile():

    tile = get_worldcover_tile(
        15.3173,
        75.7139
    )

    assert tile == "N15E075"


def test_land_use():

    latitude = 15.3173
    longitude = 75.7139

    land_use = get_land_use(
        latitude,
        longitude
    )

    print("\nLand Use Result:")
    print(land_use)

    assert land_use in [
        "Forest",
        "Wetland",
        "Bare land",
        "Grassland",
        "Built-up",
        "Agricultural",
        "Water",
    ]