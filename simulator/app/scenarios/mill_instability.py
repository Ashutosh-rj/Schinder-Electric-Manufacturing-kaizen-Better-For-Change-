import math
from app.scenarios.base import BaseScenario

class MillInstabilityScenario(BaseScenario):
    def __init__(self):
        super().__init__("mill_instability")
        
    def step(self):
        self.iteration += 1
        # Sine wave 10 min period (assume 1 iteration = 5s, so 120 iterations = 1 period)
        # mod oscillates ±15%
        mod = 1.0 + 0.15 * math.sin(self.iteration * 2 * math.pi / 120.0)
        
        return self._generate_readings(1.0, rm_feed_mod=mod, cm_vib_mult=1.4)
