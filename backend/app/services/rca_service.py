"""
RCA (Root Cause Analysis) Service
Identifies the root cause of energy inefficiencies and process deviations based on hierarchical propagation.
"""

def diagnose(area: str, symptoms: dict) -> list[dict]:
    causes = []
    
    # RAW MILL RULES
    if area == "RAW_MILL":
        if symptoms.get('high_dp') and symptoms.get('high_vibration'):
            causes.append({"root_cause": "Mill choking / overload", "confidence": 0.95})
        if symptoms.get('low_production') and symptoms.get('high_energy'):
            causes.append({"root_cause": "Poor grindability of raw material", "confidence": 0.80})
        if symptoms.get('low_outlet_temp'):
            causes.append({"root_cause": "High feed moisture or low hot gas availability", "confidence": 0.85})
        if symptoms.get('high_rejects'):
            causes.append({"root_cause": "Separator wear or sub-optimal separator speed", "confidence": 0.90})
        if symptoms.get('high_dp') and not symptoms.get('high_vibration'):
            causes.append({"root_cause": "High circulating load due to poor separation", "confidence": 0.82})
            
    # KILN RULES
    elif area == "KILN":
        if symptoms.get('high_heat_consumption') and symptoms.get('high_co'):
            causes.append({"root_cause": "Incomplete combustion due to poor coal quality or low primary air", "confidence": 0.92})
        if symptoms.get('burning_zone_low') and symptoms.get('high_free_lime'):
            causes.append({"root_cause": "Under-burning condition", "confidence": 0.95})
        if symptoms.get('high_shell_temp'):
            causes.append({"root_cause": "Refractory wear or coating loss", "confidence": 0.98})
        if symptoms.get('high_torque') and symptoms.get('temp_fluctuation'):
            causes.append({"root_cause": "Ring formation tendency in burning zone", "confidence": 0.85})
        if symptoms.get('high_o2') and symptoms.get('low_cooler_temp'):
            causes.append({"root_cause": "Excess false air ingress in system", "confidence": 0.88})

    # COOLER RULES
    elif area == "COOLER":
        if symptoms.get('low_secondary_air') and symptoms.get('high_bed_depth'):
            causes.append({"root_cause": "Snowman formation or poor clinker distribution", "confidence": 0.90})
        if symptoms.get('low_efficiency') and symptoms.get('high_exhaust_temp'):
            causes.append({"root_cause": "Sub-optimal cooling air distribution", "confidence": 0.85})
        if symptoms.get('grate_drive_high_pressure'):
            causes.append({"root_cause": "Clinker agglomeration on grates", "confidence": 0.92})
            
    # CEMENT MILL RULES
    elif area == "CEMENT_MILL":
        if symptoms.get('high_dp') and symptoms.get('low_production'):
            causes.append({"root_cause": "Diaphragm blinding or material hold-up", "confidence": 0.88})
        if symptoms.get('high_vibration'):
            causes.append({"root_cause": "Empty mill running or broken liner plates", "confidence": 0.90})
        if symptoms.get('high_energy') and symptoms.get('low_blaine'):
            causes.append({"root_cause": "Grinding media wear or poor separator efficiency", "confidence": 0.85})
        if symptoms.get('blaine_deviation'):
            causes.append({"root_cause": "Separator speed control issue or variable feed grindability", "confidence": 0.82})
            
    # CROSS PLANT & WHRS
    elif area == "WHRS":
        if symptoms.get('low_generation') and symptoms.get('low_kiln_exhaust_temp'):
            causes.append({"root_cause": "Excellent kiln thermal efficiency leaving low heat for WHRS", "confidence": 0.90})
        if symptoms.get('low_generation') and symptoms.get('high_kiln_exhaust_temp'):
            causes.append({"root_cause": "Boiler tube scaling / fouling", "confidence": 0.95})
            
    elif area == "CROSS_PLANT":
        if symptoms.get('whrs_degradation'):
            causes.append({"root_cause": "Grid import increase due to WHRS shortfall", "confidence": 0.95})
        if symptoms.get('quality_variation'):
            causes.append({"root_cause": "Heat consumption increase to maintain clinker quality", "confidence": 0.88})
            
    # INSTRUMENTATION
    elif area == "INSTRUMENTATION":
        if symptoms.get('frozen_sensor'):
            causes.append({"root_cause": "Transmitter fault or clogged impulse line", "confidence": 0.99})
        if symptoms.get('drifting_sensor'):
            causes.append({"root_cause": "Sensor calibration issue or thermocouple degradation", "confidence": 0.95})
            
    # Fallback rules
    if not causes:
        causes.append({"root_cause": "Multiple interacting factors. Require further manual investigation.", "confidence": 0.50})
        
    return sorted(causes, key=lambda x: x['confidence'], reverse=True)
