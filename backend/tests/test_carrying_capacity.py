import pytest

from app.schemas.site import CandidateSite, RelocationDemand
from app.services.carrying_capacity.calculator import (
    calculate_site_capacity,
    capacity_score,
)
from app.services.carrying_capacity.resources import (
    effective_capacity,
    capacity_surplus,
    has_sufficient_capacity,
)
from app.services.relocation.candidate_sites import (
    filter_candidate_sites,
)
from app.services.relocation.optimizer import (
    optimize_relocation,
)


def make_site(
    site_id="S001",
    hazard_level=0,
    housing=1000,
    population_capacity=1000,
    road=90,
    healthcare=90,
    water=90,
    lat=12.9716,
    lon=77.5946,
):
    return CandidateSite(
        site_id=site_id,
        latitude=lat,
        longitude=lon,
        hazard_level=hazard_level,
        hazard_score=None,
        available_land_area=10,
        estimated_housing_capacity=housing,
        existing_population=0,
        available_population_capacity=population_capacity,
        water_score=water,
        road_score=road,
        healthcare_score=healthcare,
        school_score=90,
    )


def make_habitation(population=500):
    return RelocationDemand(
        habitation_id="H001",
        latitude=12.9716,
        longitude=77.5946,
        population_to_relocate=population,
        hazard_level=3,
    )


def test_effective_capacity():

    assert effective_capacity(
        1000,
        700,
    ) == 700


def test_capacity_surplus():

    assert capacity_surplus(
        1000,
        600,
    ) == 400


def test_sufficient_capacity():

    assert has_sufficient_capacity(
        1000,
        600,
    )


def test_insufficient_capacity():

    assert not has_sufficient_capacity(
        400,
        600,
    )


def test_site_capacity():

    site = make_site(
        housing=1000,
        population_capacity=800,
    )

    assert calculate_site_capacity(site) == 800


def test_capacity_score():

    assert capacity_score(
        1000,
        500,
    ) == 100.0


def test_unsafe_site_is_rejected():

    habitation = make_habitation(500)

    unsafe = make_site(
        site_id="UNSAFE",
        hazard_level=4,
    )

    feasible, rejected = filter_candidate_sites(
        500,
        [unsafe],
    )

    assert len(feasible) == 0
    assert len(rejected) == 1
    assert "Unsafe hazard level" in rejected[0].reasons


def test_low_capacity_site_is_rejected():

    habitation = make_habitation(500)

    site = make_site(
        site_id="SMALL",
        hazard_level=0,
        housing=100,
        population_capacity=100,
    )

    feasible, rejected = filter_candidate_sites(
        500,
        [site],
    )

    assert len(feasible) == 0
    assert "Insufficient carrying capacity" in rejected[0].reasons


def test_safe_site_is_accepted():

    site = make_site(
        site_id="SAFE",
        hazard_level=0,
        housing=1000,
        population_capacity=1000,
    )

    feasible, rejected = filter_candidate_sites(
        500,
        [site],
    )

    assert len(feasible) == 1
    assert len(rejected) == 0


def test_optimizer_returns_recommendation():

    habitation = make_habitation(500)

    sites = [
        make_site(
            site_id="A",
            hazard_level=0,
            housing=1000,
            population_capacity=1000,
        ),
        make_site(
            site_id="B",
            hazard_level=1,
            housing=1000,
            population_capacity=1000,
        ),
    ]

    result = optimize_relocation(
        habitation,
        sites,
        top_n=2,
    )

    assert len(result["recommendations"]) == 2
    assert result["recommendations"][0].rank == 1


def test_optimizer_excludes_unsafe_sites():

    habitation = make_habitation(500)

    sites = [
        make_site(
            site_id="UNSAFE",
            hazard_level=4,
        ),
        make_site(
            site_id="SAFE",
            hazard_level=0,
        ),
    ]

    result = optimize_relocation(
        habitation,
        sites,
        top_n=3,
    )

    ids = [
        item.site_id
        for item in result["recommendations"]
    ]

    assert "UNSAFE" not in ids
    assert "SAFE" in ids