from app.scenarios.base import BaseScenario

class KilnDisturbanceScenario(BaseScenario):
    def __init__(self):
        super().__init__("kiln_disturbance")
        
    def step(self):
        self.iteration += 1
        # BZT drops 80, fuel rate adjust
        return self._generate_readings(1.0, kiln_bzt_offset=-80, kiln_fuel_offset=1.5)
