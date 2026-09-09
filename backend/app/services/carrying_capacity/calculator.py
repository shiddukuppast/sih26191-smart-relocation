"""
Carrying-capacity calculator for candidate relocation sites.
"""

from .resources import effective_capacity


def calculate_site_capacity(site) -> int:
    """
    Calculate the usable population capacity of a site.

    Both housing and population capacity are considered.
    """

    return effective_capacity(
        site.estimated_housing_capacity,
        site.available_population_capacity,
    )


def calculate_capacity_utilization(
    population_to_relocate: int,
    site_capacity: int,
) -> float:
    """
    Calculate how much of the site's capacity would be used.

    Returns a percentage from 0 to 100.
    """

    if population_to_relocate < 0:
        raise ValueError("Population to relocate cannot be negative.")

    if site_capacity < 0:
        raise ValueError("Site capacity cannot be negative.")

    if site_capacity == 0:
        return 100.0 if population_to_relocate > 0 else 0.0

    return min(
        100.0,
        (population_to_relocate / site_capacity) * 100.0,
    )


def capacity_score(
    site_capacity: int,
    population_to_relocate: int,
) -> float:
    """
    Convert capacity availability into a 0-100 suitability score.

    A site that can accommodate exactly the required population
    receives 100. Additional capacity also remains fully suitable.
    """

    if population_to_relocate <= 0:
        return 100.0

    if site_capacity <= 0:
        return 0.0

    ratio = site_capacity / population_to_relocate

    return min(100.0, ratio * 100.0)