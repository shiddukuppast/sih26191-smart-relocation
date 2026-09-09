"""
Member 5 relocation API route.
"""

from dataclasses import asdict
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ...schemas.site import CandidateSite, RelocationDemand
from ...services.relocation.optimizer import optimize_relocation


router = APIRouter(
    prefix="/relocation",
    tags=["Relocation"],
)


class RelocationRequest(BaseModel):

    habitation_id: str

    latitude: float = Field(
        ge=-90,
        le=90,
    )

    longitude: float = Field(
        ge=-180,
        le=180,
    )

    population_to_relocate: int = Field(
        ge=0,
    )

    hazard_level: int = Field(
        ge=0,
        le=4,
    )

    hazard_score: float | None = None
    vulnerability_score: float | None = None
    priority_score: float | None = None

    candidate_sites: List[CandidateSite]

    top_n: int = Field(
        default=3,
        ge=1,
        le=20,
    )


@router.post("/recommend")
def recommend_relocation(request: RelocationRequest):

    try:

        habitation = RelocationDemand(
            habitation_id=request.habitation_id,
            latitude=request.latitude,
            longitude=request.longitude,
            population_to_relocate=(
                request.population_to_relocate
            ),
            hazard_level=request.hazard_level,
            hazard_score=request.hazard_score,
            vulnerability_score=request.vulnerability_score,
            priority_score=request.priority_score,
        )

        result = optimize_relocation(
            habitation=habitation,
            candidate_sites=request.candidate_sites,
            top_n=request.top_n,
        )

        return {
            "habitation_id": result["habitation_id"],
            "population_to_relocate": (
                result["population_to_relocate"]
            ),
            "summary": result["summary"],
            "recommendations": [
                asdict(item)
                for item in result["recommendations"]
            ],
            "rejected_sites": [
                asdict(item)
                for item in result["rejected_sites"]
            ],
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )