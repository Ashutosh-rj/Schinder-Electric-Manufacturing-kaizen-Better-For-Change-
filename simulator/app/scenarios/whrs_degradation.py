from app.scenarios.base import BaseScenario

class WHRSDegradationScenario(BaseScenario):
    def __init__(self):
        super().__init__("whrs_degradation")
        
    def step(self):
        self.iteration += 1
        return self._generate_readings(1.0, whrs_eff_mod=0.75)
