def analyze_cement_mill(current_state: dict) -> dict:
    dp = current_state.get('dp_mmwc', 400)
    power = current_state.get('power_kw', 4200)
    
    return {
        "production": {
            "current_tph": 145,
            "target_tph": 150
        },
        "specific_energy": {
            "current_kwh_t": power / 145 if 145 > 0 else 0,
            "target_kwh_t": 30.0,
            "status": "HIGH" if (power/145) > 31 else "NORMAL"
        },
        "blaine_prediction": {
            "predicted_cm2g": 3850,
            "confidence_pct": 92
        },
        "separator_efficiency": 82.5,
        "recommendations": [
            {"action": "Check separator speed if Blaine > target", "advisory": True}
        ]
    }
