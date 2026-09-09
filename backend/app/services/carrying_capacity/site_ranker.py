"""
Multi-factor candidate-site ranking.
"""

from math import radians, sin, cos, sqrt, atan2
from typing import Dict, List

from ...schemas.site import SiteRecommendation
from .calculator import calculate_site_capacity, capacity_score


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate great-circle distance between two geographic coordinates.

    Returns:
        Distance in kilometres.
    """
    earth_radius_km = 6371.0

    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)
    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1_rad)
        * cos(lat2_rad)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return earth_radius_km * c


DEFAULT_WEIGHTS = {
    "safety": 0.40,
    "capacity": 0.25,
    "accessibility": 0.10,
    "healthcare": 0.10,
    "distance": 0.10,
    "water": 0.05,
}


def validate_weights(weights: Dict[str, float]) -> None:
    """Ensure ranking weights are valid."""

    if any(value < 0 for value in weights.values()):
        raise ValueError("Weights cannot be negative.")

    if abs(sum(weights.values()) - 1.0) > 1e-9:
        raise ValueError("Weights must sum to 1.0.")


def safety_score(hazard_level: int) -> float:
    """Convert hazard level into a safety score."""

    if hazard_level not in range(5):
        raise ValueError("Hazard level must be between 0 and 4.")

    return ((4 - hazard_level) / 4.0) * 100.0


def accessibility_score(value: float) -> float:
    return max(0.0, min(100.0, value))


def healthcare_score(value: float) -> float:
    return max(0.0, min(100.0, value))


def water_score(value: float) -> float:
    return max(0.0, min(100.0, value))


def distance_score(distance_km: float) -> float:
    """
    Distance score.

    0 km -> 100
    50 km or more -> 0
    """

    return max(
        0.0,
        min(
            100.0,
            100.0 * (1.0 - distance_km / 50.0),
        ),
    )


def calculate_component_scores(
    site,
    site_capacity: int,
    population_to_relocate: int,
    distance_km: float,
) -> Dict[str, float]:

    return {
        "safety": safety_score(site.hazard_level),
        "capacity": capacity_score(
            site_capacity,
            population_to_relocate,
        ),
        "accessibility": accessibility_score(
            site.road_score
        ),
        "healthcare": healthcare_score(
            site.healthcare_score
        ),
        "distance": distance_score(distance_km),
        "water": water_score(site.water_score),
    }


def calculate_suitability_score(
    components: Dict[str, float],
    weights: Dict[str, float] = DEFAULT_WEIGHTS,
) -> float:

    validate_weights(weights)

    return round(
        sum(
            components[key] * weights[key]
            for key in weights
        ),
        2,
    )


def rank_candidate_sites(
    habitation,
    candidate_sites: List,
    weights: Dict[str, float] = DEFAULT_WEIGHTS,
) -> List[SiteRecommendation]:

    validate_weights(weights)

    rows = []

    for site in candidate_sites:

        capacity = calculate_site_capacity(site)

        distance = haversine_km(
            habitation.latitude,
            habitation.longitude,
            site.latitude,
            site.longitude,
        )

        components = calculate_component_scores(
            site,
            capacity,
            habitation.population_to_relocate,
            distance,
        )

        score = calculate_suitability_score(
            components,
            weights,
        )

        rows.append(
            {
                "site": site,
                "capacity": capacity,
                "distance": distance,
                "components": components,
                "score": score,
            }
        )

    rows.sort(
        key=lambda row: (
            -row["score"],
            row["site"].site_id,
        )
    )

    recommendations = []

    for rank, row in enumerate(rows, start=1):

        site = row["site"]
        capacity = row["capacity"]
        distance = row["distance"]
        components = row["components"]
        score = row["score"]

        surplus = (
            capacity -
            habitation.population_to_relocate
        )

        strengths = []

        if components["safety"] >= 75:
            strengths.append("low hazard exposure")

        if components["capacity"] >= 90:
            strengths.append("sufficient carrying capacity")

        if components["accessibility"] >= 75:
            strengths.append("good road accessibility")

        if components["healthcare"] >= 75:
            strengths.append("good healthcare access")

        if components["water"] >= 75:
            strengths.append("good water availability")

        if components["distance"] >= 75:
            strengths.append("relatively short distance")

        reason = (
            ", ".join(strengths)
            if strengths
            else "strongest overall weighted suitability score"
        )

        recommendations.append(
            SiteRecommendation(
                rank=rank,
                site_id=site.site_id,
                distance_km=round(distance, 2),
                hazard_score=site.hazard_score,
                hazard_level=site.hazard_level,
                effective_capacity=capacity,
                capacity_surplus=surplus,
                suitability_score=score,
                component_scores={
                    key: round(value, 2)
                    for key, value in components.items()
                },
                explanation=(
                    f"Recommended because of {reason}."
                ),
            )
        )

    return recommendations