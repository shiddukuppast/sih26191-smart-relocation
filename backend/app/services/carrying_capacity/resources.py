"""
Carrying-capacity resource calculations.
"""


def effective_capacity(
    estimated_housing_capacity: int,
    available_population_capacity: int,
) -> int:
    """
    Effective usable capacity is limited by both housing
    capacity and available population capacity.
    """

    if estimated_housing_capacity < 0:
        raise ValueError("Housing capacity cannot be negative.")

    if available_population_capacity < 0:
        raise ValueError("Population capacity cannot be negative.")

    return min(
        estimated_housing_capacity,
        available_population_capacity,
    )


def capacity_surplus(
    effective_capacity_value: int,
    population_to_relocate: int,
) -> int:
    """Calculate remaining capacity after relocation."""

    if population_to_relocate < 0:
        raise ValueError("Population to relocate cannot be negative.")

    return effective_capacity_value - population_to_relocate


def has_sufficient_capacity(
    effective_capacity_value: int,
    population_to_relocate: int,
) -> bool:
    """Return whether the site can accommodate the population."""

    return effective_capacity_value >= population_to_relocate