from app.scenarios.base import BaseScenario
from app.scenarios.normal import NormalScenario
from app.scenarios.fan_degradation import FanDegradationScenario
from app.scenarios.energy_inefficiency import EnergyInefficiencyScenario
from app.scenarios.mill_instability import MillInstabilityScenario
from app.scenarios.kiln_disturbance import KilnDisturbanceScenario
from app.scenarios.whrs_degradation import WHRSDegradationScenario
from app.scenarios.cpp_issue import CPPIssueScenario
from app.scenarios.sensor_failure import SensorFailureScenario

def get_scenario(name: str) -> BaseScenario:
    scenarios = {
        "normal": NormalScenario,
        "fan_degradation": FanDegradationScenario,
        "energy_inefficiency": EnergyInefficiencyScenario,
        "mill_instability": MillInstabilityScenario,
        "kiln_disturbance": KilnDisturbanceScenario,
        "whrs_degradation": WHRSDegradationScenario,
        "cpp_issue": CPPIssueScenario,
        "sensor_failure": SensorFailureScenario
    }
    return scenarios.get(name, NormalScenario)()
