from app.services.hazard.rainfall import get_rainfall_features


def test_rainfall_api():

    latitude = 15.3173
    longitude = 75.7139

    rainfall = get_rainfall_features(
        latitude,
        longitude
    )

    print("\nRainfall Result:")
    print(rainfall)

    assert "rainfall_24h_mm" in rainfall
    assert "rainfall_7d_mm" in rainfall

    assert isinstance(rainfall["rainfall_24h_mm"], float)
    assert isinstance(rainfall["rainfall_7d_mm"], float)

    assert rainfall["rainfall_24h_mm"] >= 0
    assert rainfall["rainfall_7d_mm"] >= 0