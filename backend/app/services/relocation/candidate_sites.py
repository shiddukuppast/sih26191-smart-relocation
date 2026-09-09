"""
Candidate relocation site filtering.

Member 5 does not generate geographic locations from nothing.
It receives candidate sites from the available site/GIS data and
filters them according to safety and capacity constraints.
"""

from typing import List, Tuple

from ..carrying_capacity.calculator import calculate_site_capacity
from ...schemas.site import RejectedSite


DEFAULT_MAX_HAZARD_LEVEL = 2


def validate_candidate_site(site) -> List[str]:
    """Validate basic candidate-site fields."""

    errors = []

    if not (-90 <= site.latitude <= 90):
        errors.append("Invalid latitude")

    if not (-180 <= site.longitude <= 180):
        errors.append("Invalid longitude")

    if site.hazard_level not in range(5):
        errors.append("Invalid hazard level")

    if site.available_land_area < 0:
        errors.append("Negative available land area")

    if site.estimated_housing_capacity < 0:
        errors.append("Negative housing capacity")

    if site.existing_population < 0:
        errors.append("Negative existing population")

    if site.available_population_capacity < 0:
        errors.append("Negative population capacity")

    return errors


def filter_candidate_sites(
    population_to_relocate: int,
    candidate_sites: List,
    max_hazard_level: int = DEFAULT_MAX_HAZARD_LEVEL,
) -> Tuple[List, List[RejectedSite]]:
    """
    Filter candidate sites using hard safety and capacity constraints.
    """

    if population_to_relocate < 0:
        raise ValueError(
            "Population to relocate cannot be negative."
        )

    feasible = []
    rejected = []

    for site in candidate_sites:

        reasons = validate_candidate_site(site)

        if site.hazard_level > max_hazard_level:
            reasons.append("Unsafe hazard level")

        capacity = calculate_site_capacity(site)

        if capacity < population_to_relocate:
            reasons.append("Insufficient carrying capacity")

        if reasons:
            rejected.append(
                RejectedSite(
                    site_id=site.site_id,
                    reasons=reasons,
                )
            )
        else:
            feasible.append(site)

    return feasible, rejected