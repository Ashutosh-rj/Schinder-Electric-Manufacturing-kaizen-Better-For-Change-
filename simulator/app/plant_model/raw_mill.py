import numpy as np

class RawMill:
    def __init__(self):
        self.feed_rate = 200.0
        self.sep_speed = 120.0
        
    def step(self, feed_modifier=1.0):
        feed = self.feed_rate * feed_modifier
        sep_speed = self.sep_speed
        
        mill_power = 2500 + (feed * 3.5) + (sep_speed * 2) + np.random.normal(0, 80)
        product_fineness = 3200 + (sep_speed * 15) - (feed * 2) + np.random.normal(0, 100)
        diff_pressure = 40 + (feed * 0.05) + np.random.normal(0, 3)
        
        return {
            "RM-FEED": feed,
            "RM-SEP-SPEED": sep_speed,
            "RM-POWER": mill_power,
            "RM-FINENESS": product_fineness,
            "RM-DP": diff_pressure
        }
