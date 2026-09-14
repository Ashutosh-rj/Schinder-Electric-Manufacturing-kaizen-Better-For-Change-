from app.scenarios.base import BaseScenario

class NormalScenario(BaseScenario):
    def __init__(self):
        super().__init__("normal")
        
    def step(self):
        self.iteration += 1
        return super().step()
