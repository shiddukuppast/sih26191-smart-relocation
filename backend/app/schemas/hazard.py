from pydantic import BaseModel, Field


class HazardRequest(BaseModel):
    """
    Input received by the hazard prediction API.
    """

    latitude: float = Field(
        ...,
        ge=-90,
        le=90,
        description="Latitude of the location"
    )

    longitude: float = Field(
        ...,
        ge=-180,
        le=180,
        description="Longitude of the location"
    )


class HazardFeatures(BaseModel):
    """
    Features required by the trained hazard models.
    """

    rainfall_24h_mm: float
    rainfall_7d_mm: float
    slope_deg: float
    elevation_m: float
    land_use: str
    distance_to_river_m: float
    soil_type: str
    historical_landslide_count: int
    historical_flood_count: int
    built_up_percentage: float


class HazardPrediction(BaseModel):
    """
    Prediction returned by the hazard models.
    """

    hazard_level: int


class HazardResponse(BaseModel):
    """
    Complete response returned by the hazard API.
    """

    latitude: float
    longitude: float
    features: HazardFeatures
    flood: HazardPrediction
    landslide: HazardPrediction