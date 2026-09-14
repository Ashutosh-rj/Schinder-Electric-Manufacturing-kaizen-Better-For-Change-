from app.scenarios.base import BaseScenario

class CPPIssueScenario(BaseScenario):
    def __init__(self):
        super().__init__("cpp_issue")
        
    def step(self):
        self.iteration += 1
        return self._generate_readings(1.0, cpp_eff_mod=0.24/0.31, cpp_power_offset=-1275)
