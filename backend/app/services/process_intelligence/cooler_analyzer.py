def analyze_cooler(current_state: dict) -> dict:
    sec_air = current_state.get('sec_air_temp_c', 1050)
    exhaust_temp = current_state.get('exhaust_temp_c', 285)
    
    return {
        "efficiency": {
            "current_pct": 72.3,
            "target_pct": 75.0,
            "status": "LOW_SIDE" if 72.3 < 74.0 else "NORMAL"
        },
        "secondary_air": {
            "temp_c": sec_air,
            "assessment": "GOOD" if sec_air > 900 else "LOW"
        },
        "heat_recuperation": 68.5,
        "whrs_input": {
            "exhaust_temp_c": exhaust_temp,
            "assessment": "OPTIMAL" if 280 <= exhaust_temp <= 320 else "SUBOPTIMAL"
        },
        "recommendations": [
            {"action": "Optimize grate speed distribution", "advisory": True}
        ]
    }
