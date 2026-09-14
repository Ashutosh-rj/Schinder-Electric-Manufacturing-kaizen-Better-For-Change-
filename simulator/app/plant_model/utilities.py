import numpy as np

class Utilities:
    def __init__(self):
        self.aux_power_base = 2800.0
        
    def step(self, power_modifier=1.0):
        aux_power = self.aux_power_base * power_modifier + np.random.normal(0, 30)
        return {
            "UTIL-AUX-POWER": aux_power
        }
