import numpy as np

class Kiln:
    def __init__(self):
        self.feed_rate = 280.0
        self.speed = 3.2
        self.fuel_rate = 12.0
        
    def step(self, feed_modifier=1.0, bzt_offset=0, fuel_offset=0):
        feed_rate = self.feed_rate * feed_modifier
        fuel_rate = self.fuel_rate + fuel_offset
        speed = self.speed
        
        bzt = 1380 + (feed_rate * 0.15) + (fuel_rate * 5) + np.random.normal(0, 10) + bzt_offset
        draft = 5.0 # static value for now
        o2 = max(0, 2.5 - (fuel_rate * 0.08) + (draft * 0.1) + np.random.normal(0, 0.2))
        nox = max(0, 800 + (bzt * 0.3) + (o2 * -50) + np.random.normal(0, 20))
        cooler_temp = bzt * 0.35 + np.random.normal(0, 15)
        preheater_exit_temp = 320 + (feed_rate * 0.1) + np.random.normal(0, 8)
        clinker_production = feed_rate * 0.655 + np.random.normal(0, 2)
        kiln_power = 2800 + (feed_rate * 1.5) + (speed * 200) + np.random.normal(0, 50)
        
        return {
            "KILN-BZT": bzt,
            "KILN-O2": o2,
            "KILN-NOX": nox,
            "KILN-COOLER-TEMP": cooler_temp,
            "KILN-PH-EXIT-TEMP": preheater_exit_temp,
            "KILN-CLINKER-PROD": clinker_production,
            "KILN-POWER": kiln_power,
            "KILN-FEED": feed_rate,
            "KILN-FUEL": fuel_rate,
            "KILN-SPEED": speed
        }
