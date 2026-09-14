def analyze_raw_mill(current_state: dict) -> dict:
    dp = current_state.get('mill_dp_mmwc', 650)
    temp = current_state.get('outlet_temp_c', 85)
    vib = current_state.get('vibration_mms', 3.5)
    
    state_assessment = "NORMAL"
    if dp > 800:
        state_assessment = "CHOKING_RISK"
    elif dp > 750:
        state_assessment = "HIGH_DP"
    elif vib > 6:
        state_assessment = "VIBRATION_WARNING"
    elif temp < 75:
        state_assessment = "POOR_DRYING"
        
    return {
        "state_assessment": state_assessment,
        "compliance": {
            "dp": "IN_WINDOW" if 500 <= dp <= 750 else "OUT_OF_WINDOW",
            "temp": "IN_WINDOW" if 80 <= temp <= 95 else "OUT_OF_WINDOW"
        },
        "specific_energy": {
            "current_kwh_t": 18.2,
            "target_kwh_t": 18.0
        },
        "grinding_efficiency": 88.5,
        "recommendations": [
            {"action": "Check reject handling" if state_assessment == "HIGH_DP" else "Maintain operation", "advisory": True}
        ],
        "key_parameters": {
            "dp": {"current": dp, "target": 650},
            "temp": {"current": temp, "target": 85}
        }
    }
