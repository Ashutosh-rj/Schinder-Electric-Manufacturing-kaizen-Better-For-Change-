def analyze_kiln(current_state: dict) -> dict:
    o2 = current_state.get('o2_pct', 3.0)
    co = current_state.get('co_ppm', 100)
    bz_temp = current_state.get('bz_temp_c', 1450)
    sec_air = current_state.get('sec_air_temp_c', 1050)
    
    combustion_status = "NORMAL"
    if co > 500 or o2 < 2.0:
        combustion_status = "REDUCING_CONDITIONS"
    elif o2 > 4.0:
        combustion_status = "EXCESS_AIR"
        
    bz_status = "OPTIMAL"
    if bz_temp < 1380:
        bz_status = "COLD"
    elif bz_temp > 1480:
        bz_status = "HOT"
        
    return {
        "combustion_analysis": combustion_status,
        "heat_consumption": {
            "current_kcal_kg": 745,
            "target_kcal_kg": 735,
            "status": "ELEVATED"
        },
        "burning_zone": bz_status,
        "quality_risk": "HIGH" if combustion_status == "REDUCING_CONDITIONS" else "LOW",
        "stability_index": 92.5,
        "cross_system": {
            "cooler_coupling": "GOOD" if sec_air > 900 else "POOR"
        },
        "recommendations": [
            {"action": "Reduce primary air" if combustion_status == "EXCESS_AIR" else "Monitor CO", "advisory": True}
        ]
    }
