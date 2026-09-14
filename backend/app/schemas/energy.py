from pydantic import BaseModel
from typing import List

class DeptSEC(BaseModel):
    department: str
    sec: float
    target: float

class SECResponse(BaseModel):
    current_sec_kwh_ton_clinker: float
    current_sec_kwh_ton_cement: float
    target_sec: float
    best_sec: float
    benchmark_sec: float
    deviation_pct: float
    potential_saving_kwh: float
    trend: str
    by_department: List[DeptSEC]
