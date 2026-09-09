from types import SimpleNamespace

import pytest

from app.services.relocation.candidate_sites import (
    validate_candidate_site,
    filter_candidate_sites,
)
from app.services.relocation.optimizer import optimize_relocation


def make_site(
    site_id="SITE-1",
    latitude=12.9716,
    longitude=77.5946,
    hazard_level=1,
    available_land_area=1000,
    estimated_housing_capacity=500,
    existing_population=100,
    available_population_capacity=500,
    hazard_score=20.0,
    road_score=80.0,
    healthcare_score=80.0,
    water_score=80.0,
):
    return SimpleNamespace(
        site_id=site_id,
        latitude=latitude,
        longitude=longitude,
        hazard_level=hazard_level,
        available_land_area=available_land_area,
        estimated_housing_capacity=estimated_housing_capacity,
        existing_population=existing_population,
        available_population_capacity=available_population_capacity,
        hazard_score=hazard_score,
        road_score=road_score,
        healthcare_score=healthcare_score,
        water_score=water_score,
    )


def make_habitation(
    habitation_id="HAB-1",
    latitude=12.9716,
    longitude=77.5946,
    population_to_relocate=100,
):
    return SimpleNamespace(
        habitation_id=habitation_id,
        latitude=latitude,
        longitude=longitude,
        population_to_relocate=population_to_relocate,
    )


# ---------------------------------------------------------
# Candidate-site validation
# ---------------------------------------------------------

def test_valid_candidate_site():
    site = make_site()

    errors = validate_candidate_site(site)

    assert errors == []


def test_invalid_candidate_site():
    site = make_site(
        latitude=100,
        longitude=200,
        hazard_level=5,
        available_land_area=-1,
        estimated_housing_capacity=-1,
        existing_population=-1,
        available_population_capacity=-1,
    )

    errors = validate_candidate_site(site)

    assert "Invalid latitude" in errors
    assert "Invalid longitude" in errors
    assert "Invalid hazard level" in errors
    assert "Negative available land area" in errors
    assert "Negative housing capacity" in errors
    assert "Negative existing population" in errors
    assert "Negative population capacity" in errors


# ---------------------------------------------------------
# Candidate-site filtering
# ---------------------------------------------------------

def test_unsafe_site_is_rejected():
    site = make_site(
        site_id="UNSAFE",
        hazard_level=4,
    )

    feasible, rejected = filter_candidate_sites(
        population_to_relocate=100,
        candidate_sites=[site],
    )

    assert feasible == []
    assert len(rejected) == 1
    assert rejected[0].site_id == "UNSAFE"
    assert "Unsafe hazard level" in rejected[0].reasons


def test_low_capacity_site_is_rejected():
    site = make_site(
        site_id="LOW-CAPACITY",
        estimated_housing_capacity=50,
        available_population_capacity=50,
    )

    feasible, rejected = filter_candidate_sites(
        population_to_relocate=100,
        candidate_sites=[site],
    )

    assert feasible == []
    assert len(rejected) == 1
    assert rejected[0].site_id == "LOW-CAPACITY"
    assert "Insufficient carrying capacity" in rejected[0].reasons


def test_safe_and_sufficient_site_is_accepted():
    site = make_site(
        site_id="GOOD-SITE",
        hazard_level=1,
        estimated_housing_capacity=500,
        available_population_capacity=500,
    )

    feasible, rejected = filter_candidate_sites(
        population_to_relocate=100,
        candidate_sites=[site],
    )

    assert len(feasible) == 1
    assert feasible[0].site_id == "GOOD-SITE"
    assert rejected == []


def test_mixed_candidate_sites_are_filtered():
    safe_site = make_site(
        site_id="SAFE",
        hazard_level=1,
    )

    unsafe_site = make_site(
        site_id="UNSAFE",
        hazard_level=4,
    )

    low_capacity_site = make_site(
        site_id="LOW-CAPACITY",
        estimated_housing_capacity=20,
        available_population_capacity=20,
    )

    feasible, rejected = filter_candidate_sites(
        population_to_relocate=100,
        candidate_sites=[
            safe_site,
            unsafe_site,
            low_capacity_site,
        ],
    )

    assert len(feasible) == 1
    assert feasible[0].site_id == "SAFE"

    assert len(rejected) == 2

    rejected_ids = {
        site.site_id for site in rejected
    }

    assert rejected_ids == {
        "UNSAFE",
        "LOW-CAPACITY",
    }


def test_negative_population_is_rejected():
    site = make_site()

    with pytest.raises(ValueError):
        filter_candidate_sites(
            population_to_relocate=-10,
            candidate_sites=[site],
        )


# ---------------------------------------------------------
# Relocation optimizer
# ---------------------------------------------------------

def test_optimizer_returns_recommendations():
    habitation = make_habitation(
        population_to_relocate=100,
    )

    site1 = make_site(
        site_id="SITE-1",
        latitude=12.9716,
        longitude=77.5946,
        hazard_level=1,
    )

    site2 = make_site(
        site_id="SITE-2",
        latitude=13.0827,
        longitude=80.2707,
        hazard_level=2,
    )

    result = optimize_relocation(
        habitation=habitation,
        candidate_sites=[site1, site2],
        top_n=2,
    )

    assert result["habitation_id"] == "HAB-1"
    assert result["population_to_relocate"] == 100

    assert len(result["recommendations"]) == 2

    assert result["summary"] == (
        "2 relocation recommendation(s) generated."
    )


def test_optimizer_excludes_unsafe_sites():
    habitation = make_habitation(
        population_to_relocate=100,
    )

    safe_site = make_site(
        site_id="SAFE",
        hazard_level=1,
    )

    unsafe_site = make_site(
        site_id="UNSAFE",
        hazard_level=4,
    )

    result = optimize_relocation(
        habitation=habitation,
        candidate_sites=[
            safe_site,
            unsafe_site,
        ],
    )

    recommendation_ids = {
        recommendation.site_id
        for recommendation in result["recommendations"]
    }

    assert "SAFE" in recommendation_ids
    assert "UNSAFE" not in recommendation_ids

    rejected_ids = {
        site.site_id
        for site in result["rejected_sites"]
    }

    assert "UNSAFE" in rejected_ids


def test_optimizer_respects_top_n():
    habitation = make_habitation(
        population_to_relocate=100,
    )

    sites = [
        make_site(site_id="SITE-1"),
        make_site(
            site_id="SITE-2",
            latitude=13.0,
            longitude=77.7,
        ),
        make_site(
            site_id="SITE-3",
            latitude=13.1,
            longitude=77.8,
        ),
    ]

    result = optimize_relocation(
        habitation=habitation,
        candidate_sites=sites,
        top_n=2,
    )

    assert len(result["recommendations"]) <= 2


def test_optimizer_no_feasible_site():
    habitation = make_habitation(
        population_to_relocate=1000,
    )

    site = make_site(
        site_id="INSUFFICIENT",
        estimated_housing_capacity=50,
        available_population_capacity=50,
    )

    result = optimize_relocation(
        habitation=habitation,
        candidate_sites=[site],
    )

    assert result["recommendations"] == []

    assert result["summary"] == (
        "No feasible relocation site found "
        "for the requested population."
    )

    assert len(result["rejected_sites"]) == 1
    assert result["rejected_sites"][0].site_id == "INSUFFICIENT"


def test_optimizer_rejects_invalid_top_n():
    habitation = make_habitation()

    site = make_site()

    with pytest.raises(ValueError):
        optimize_relocation(
            habitation=habitation,
            candidate_sites=[site],
            top_n=0,
        )