import numpy as np

class CementMill:
    def __init__(self):
        self.feed_rate = 180.0
        self.sep_speed = 100.0
        
    def step(self, feed_modifier=1.0, power_offset=0, vibration_multiplier=1.0):
        feed = self.feed_rate * feed_modifier
        sep_speed = self.sep_speed
        
        mill_power = 4800 + (feed * 4.2) + (sep_speed * 1.8) + np.random.normal(0, 100) + power_offset
        fineness_blaine = 3800 + (sep_speed * 18) - (feed * 2.5) + np.random.normal(0, 120)
        sec = mill_power / (feed / 60) if feed > 0 else 0
        vibration = 2.5 * vibration_multiplier + np.random.normal(0, 0.2)
        
        return {
            "CM-FEED": feed,
            "CM-SEP-SPEED": sep_speed,
            "CM-POWER": mill_power,
            "CM-FINENESS": fineness_blaine,
            "CM-SEC": sec,
            "CM-VIBRATION": vibration
        }
