import numpy as np

class CPP:
    def __init__(self):
        self.generation = 8.5
        self.efficiency = 0.31
        self.heat_rate = 3.2
        
    def step(self, efficiency_modifier=1.0, power_offset=0):
        eff = self.efficiency * efficiency_modifier
        power = 8500 + np.random.normal(0, 200) + power_offset
        if eff < self.efficiency:
            power *= (eff / self.efficiency) # drop power if eff drops
            
        return {
            "CPP-POWER": power,
            "CPP-EFFICIENCY": eff,
            "CPP-HEAT-RATE": self.heat_rate * (self.efficiency / eff) if eff > 0 else 0
        }
