from pydantic import BaseModel
from typing import List

class CopilotRequest(BaseModel):
    query: str

class CopilotResponse(BaseModel):
    query: str
    answer: str
    data_sources: List[str]
    data_timestamp: str
    confidence: str
    related_kaizen: List[str]
    disclaimer: str
