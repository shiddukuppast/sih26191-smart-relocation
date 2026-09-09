"""
Member 5 site and relocation data contracts.

These schemas are intentionally independent from Member 2/3/4
implementation files. They provide the interface consumed by the
Member 5 relocation engine.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional


@dataclass(frozen=True)
class RelocationDemand:
    """Population that needs relocation from an affected habitation."""

    habitation_id: str
    latitude: float
    longitude: float
    population_to_relocate: int

    hazard_level: int = 0
    hazard_score: Optional[float] = None
    vulnerability_score: Optional[float] = None
    priority_score: Optional[float] = None


@dataclass(frozen=True)
class CandidateSite:
    """Potential safe destination for relocation."""

    site_id: str
    latitude: float
    longitude: float

    # Safety
    hazard_level: int = 0
    hazard_score: Optional[float] = None

    # Capacity
    available_land_area: float = 0.0
    estimated_housing_capacity: int = 0
    existing_population: int = 0
    available_population_capacity: int = 0

    # Infrastructure / accessibility
    water_score: float = 0.0
    road_score: float = 0.0
    healthcare_score: float = 0.0
    school_score: float = 0.0


@dataclass
class RejectedSite:
    """A candidate site rejected before ranking."""

    site_id: str
    reasons: List[str] = field(default_factory=list)


@dataclass
class SiteRecommendation:
    """Final ranked recommendation."""

    rank: int
    site_id: str
    distance_km: float

    hazard_score: Optional[float]
    hazard_level: int

    effective_capacity: int
    capacity_surplus: int

    suitability_score: float
    component_scores: Dict[str, float]

    explanation: str