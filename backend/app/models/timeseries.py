from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"))
    value = Column(Float)
    quality = Column(String)
    timestamp = Column(DateTime)

class EnergyReading(Base):
    __tablename__ = "energy_readings"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    power_kw = Column(Float)
    timestamp = Column(DateTime)

class ProductionRecord(Base):
    __tablename__ = "production_records"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    production_tph = Column(Float)
    timestamp = Column(DateTime)
