from app.scenarios.base import BaseScenario

class FanDegradationScenario(BaseScenario):
    def __init__(self):
        super().__init__("fan_degradation")
        
    def step(self):
        self.iteration += 1
        
        # Ramp over 20 iterations
        ramp = min(1.0, self.iteration / 20.0)
        
        power_offset = 4800 * 0.15 * ramp # +15% power
        vib_mult = 1.0 + (3.0 * ramp) # +300%
        
        return self._generate_readings(1.0, cm_power_offset=power_offset, cm_vib_mult=vib_mult)
