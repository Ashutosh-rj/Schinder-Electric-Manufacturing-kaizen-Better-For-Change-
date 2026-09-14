class WHRS:
    def __init__(self):
        pass
        
    def step(self, cooler_temp, feed_rate, efficiency_modifier=1.0):
        available_heat = cooler_temp * feed_rate * 0.0015
        generation = available_heat * 0.35 * efficiency_modifier
        
        return {
            "WHRS-AVAILABLE-HEAT": available_heat,
            "WHRS-GENERATION": generation,
            "WHRS-EFFICIENCY": efficiency_modifier
        }
