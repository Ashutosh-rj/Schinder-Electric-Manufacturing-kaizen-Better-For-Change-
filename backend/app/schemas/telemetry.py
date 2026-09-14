from pydantic import BaseModel
from typing import List
from datetime import datetime

class ReadingSchema(BaseModel):
    sensor_id: int
    tag: str
    name: str
    value: float
    unit: str
    quality: str
    timestamp: datetime
    equipment_code: str
    department_code: str

class TelemetryResponse(BaseModel):
    readings: List[ReadingSchema]
