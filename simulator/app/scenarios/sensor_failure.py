import random
from app.scenarios.base import BaseScenario

class SensorFailureScenario(BaseScenario):
    def __init__(self):
        super().__init__("sensor_failure")
        self.stale_tag = None
        self.stale_val = None
        self.stale_count = 0
        
    def step(self):
        self.iteration += 1
        readings = self._generate_readings(1.0)
        
        if self.stale_count == 0:
            if random.random() < 0.2:
                # pick a tag to become stale
                r = random.choice(readings)
                self.stale_tag = r['tag']
                self.stale_val = r['value']
                self.stale_count = random.randint(10, 30)
                
        if self.stale_count > 0:
            for r in readings:
                if r['tag'] == self.stale_tag:
                    r['value'] = self.stale_val
                    r['quality'] = 'STALE'
                    break
            self.stale_count -= 1
            
        # some return None randomly
        if random.random() < 0.1:
            r = random.choice(readings)
            r['value'] = None
            r['quality'] = 'MISSING'
            
        return readings
