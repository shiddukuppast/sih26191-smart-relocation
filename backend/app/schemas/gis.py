from pydantic import BaseModel


class TerrainRequest(BaseModel):
    latitude: float
    longitude: float
    dem_path: str
    slope_path: str


class TerrainResponse(BaseModel):
    latitude: float
    longitude: float
    elevation_m: float | None
    slope_deg: float | None