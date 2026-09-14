from app.scenarios.base import BaseScenario

class EnergyInefficiencyScenario(BaseScenario):
    def __init__(self):
        super().__init__("energy_inefficiency")
        
    def step(self):
        self.iteration += 1
        return self._generate_readings(1.0, total_power_mod=1.12)
