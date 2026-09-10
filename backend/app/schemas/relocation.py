from typing import Any

from pydantic import BaseModel


class RelocationPriorityRequest(BaseModel):

    records: list[dict[str, Any]]


class RelocationPriorityResponse(BaseModel):

    status: str
    data: list[dict[str, Any]]