from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Protocol

from pydantic import BaseModel, Field


class EvidenceRef(BaseModel):
    evidence_id: str
    supports: str
    confidence: float = Field(ge=0, le=1)


class CauseHypothesisDraft(BaseModel):
    statement: str
    confidence: float = Field(ge=0, le=1)
    validation_needed: list[str]


class AlternativeDraft(BaseModel):
    code: str
    title: str
    tradeoffs: list[str]


class GdsDraft(BaseModel):
    problem: str
    evidence_refs: list[EvidenceRef]
    gaps: list[str]
    cause_hypotheses: list[CauseHypothesisDraft]
    alternatives: list[AlternativeDraft]
    recommendation_code: str | None = None
    recommendation_rationale: str
    risks: list[str]
    confidence: float = Field(ge=0, le=1)
    validation_plan: list[str]
    proposed_mission_code: str | None = None


class GenesisReadPort(Protocol):
    async def get_passport(self, *, tenant_id: str, company_id: str) -> dict[str, Any]: ...
    async def get_diagnostic(self, *, tenant_id: str, diagnostic_id: str) -> dict[str, Any]: ...
    async def get_pain_evidence(self, *, tenant_id: str, pain_id: str) -> dict[str, Any]: ...


@dataclass(frozen=True)
class GenesisDeps:
    tenant_id: str
    company_id: str
    diagnostic_id: str
    pain_id: str
    reader: GenesisReadPort
