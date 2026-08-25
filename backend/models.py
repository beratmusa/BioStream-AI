from sqlalchemy import Column, Integer, Float, DateTime, String
from sqlalchemy.sql import func
from database import Base

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    co2 = Column(Float, nullable=False)
    freezer_temp = Column(Float, nullable=False)
    vibration = Column(Float, nullable=False)
    energy_consumption = Column(Float, nullable=False)
    status = Column(String, default="Normal") # For anomaly detection later
