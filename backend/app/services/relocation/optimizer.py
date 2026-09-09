"""
Relocation optimization/orchestration.
"""

from typing import Dict, List

from ..carrying_capacity.site_ranker import (
    DEFAULT_WEIGHTS,
    rank_candidate_sites,
)
from .candidate_sites import (
    DEFAULT_MAX_HAZARD_LEVEL,
    filter_candidate_sites,
)


def optimize_relocation(
    habitation,
    candidate_sites: List,
    top_n: int = 3,
    max_hazard_level: int = DEFAULT_MAX_HAZARD_LEVEL,
    weights: Dict[str, float] = DEFAULT_WEIGHTS,
) -> dict:
    """
    Find the best relocation destinations for an affected habitation.

    Process:
        1. Filter unsafe sites.
        2. Filter sites without enough capacity.
        3. Calculate distance.
        4. Score safety, capacity, accessibility,
           healthcare, distance and water.
        5. Rank the feasible sites.
        6. Return the top recommendations.
    """

    if top_n <= 0:
        raise ValueError("top_n must be greater than zero.")

    feasible, rejected = filter_candidate_sites(
        population_to_relocate=(
            habitation.population_to_relocate
        ),
        candidate_sites=candidate_sites,
        max_hazard_level=max_hazard_level,
    )

    recommendations = rank_candidate_sites(
        habitation=habitation,
        candidate_sites=feasible,
        weights=weights,
    )

    recommendations = recommendations[:top_n]

    if not recommendations:
        summary = (
            "No feasible relocation site found "
            "for the requested population."
        )
    else:
        summary = (
            f"{len(recommendations)} relocation "
            "recommendation(s) generated."
        )

    return {
        "habitation_id": habitation.habitation_id,
        "population_to_relocate": (
            habitation.population_to_relocate
        ),
        "recommendations": recommendations,
        "rejected_sites": rejected,
        "summary": summary,
    }