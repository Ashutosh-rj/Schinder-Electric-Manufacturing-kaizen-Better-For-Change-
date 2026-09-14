import datetime
from app.plant_model.kiln import Kiln
from app.plant_model.raw_mill import RawMill
from app.plant_model.cement_mill import CementMill
from app.plant_model.whrs import WHRS
from app.plant_model.cpp import CPP
from app.plant_model.utilities import Utilities

class BaseScenario:
    def __init__(self, name="base"):
        self.name = name
        self.kiln = Kiln()
        self.raw_mill = RawMill()
        self.cement_mill = CementMill()
        self.whrs = WHRS()
        self.cpp = CPP()
        self.utilities = Utilities()
        self.iteration = 0

    def step(self):
        self.iteration += 1
        
        # Determine shift modifier
        hour = datetime.datetime.utcnow().hour
        shift_mod = 1.0
        if 6 <= hour < 14: # Shift A
            shift_mod = 1.0
        elif 14 <= hour < 22: # Shift B
            shift_mod = 0.99
        else: # Shift C
            shift_mod = 0.97
            
        # These are overridden by subclasses
        return self._generate_readings(shift_mod)
        
    def _generate_readings(self, shift_mod, **kwargs):
        k_res = self.kiln.step(feed_modifier=shift_mod, 
                               bzt_offset=kwargs.get('kiln_bzt_offset', 0),
                               fuel_offset=kwargs.get('kiln_fuel_offset', 0))
                               
        rm_res = self.raw_mill.step(feed_modifier=shift_mod * kwargs.get('rm_feed_mod', 1.0))
        
        cm_res = self.cement_mill.step(feed_modifier=shift_mod, 
                                       power_offset=kwargs.get('cm_power_offset', 0),
                                       vibration_multiplier=kwargs.get('cm_vib_mult', 1.0))
        
        whrs_res = self.whrs.step(cooler_temp=k_res['KILN-COOLER-TEMP'], 
                                  feed_rate=k_res['KILN-FEED'],
                                  efficiency_modifier=kwargs.get('whrs_eff_mod', 1.0))
                                  
        cpp_res = self.cpp.step(efficiency_modifier=kwargs.get('cpp_eff_mod', 1.0),
                                power_offset=kwargs.get('cpp_power_offset', 0))
                                
        util_res = self.utilities.step(power_modifier=kwargs.get('util_power_mod', 1.0))
        
        # Energy balance
        total_power = k_res['KILN-POWER'] + rm_res['RM-POWER'] + cm_res['CM-POWER'] + util_res['UTIL-AUX-POWER']
        if kwargs.get('total_power_mod'):
            total_power *= kwargs.get('total_power_mod')
            
        grid_import = max(0, total_power - cpp_res['CPP-POWER'] - whrs_res['WHRS-GENERATION'])
        
        res = {**k_res, **rm_res, **cm_res, **whrs_res, **cpp_res, **util_res}
        res['PLANT-TOTAL-POWER'] = total_power
        res['PLANT-GRID-IMPORT'] = grid_import
        
        # Format as expected readings list
        readings = []
        for tag, value in res.items():
            readings.append({
                "tag": tag,
                "value": round(value, 2),
                "quality": "GOOD",
                "unit": self._get_unit(tag)
            })
            
        return readings
        
    def _get_unit(self, tag):
        if "POWER" in tag or "GENERATION" in tag or "IMPORT" in tag: return "kW"
        if "TEMP" in tag or "BZT" in tag: return "C"
        if "PROD" in tag or "FEED" in tag: return "tph"
        if "NOX" in tag or "O2" in tag: return "%"
        if "FINENESS" in tag: return "cm2/g"
        if "SPEED" in tag: return "rpm"
        if "VIBRATION" in tag: return "mm/s"
        return "units"
