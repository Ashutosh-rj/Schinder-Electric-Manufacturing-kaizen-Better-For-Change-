def check_rules(sensor_data, kpis):
    alarms = []
    
    # 1. IF fan_power > baseline*1.15 AND production ≈ constant → energy inefficiency
    # 2. IF vibration > threshold AND current > threshold → equipment degradation
    # 3. IF WHRS_gen < expected*0.85 AND kiln_running → WHRS performance loss
    # 4. IF O2 < 1.5% → kiln reducing atmosphere risk
    # 5. IF BZT > 1500°C → kiln burning zone overtemperature
    # 6. IF cement_mill_SEC > target*1.1 → cement mill energy inefficiency
    # 7. IF CPP_efficiency < 0.28 → CPP performance degradation
    # 8. IF sensor flat for 15 min → stale sensor
    # 9. IF preheater_outlet > 380°C → heat loss in preheater
    # 10. IF raw_mill_diff_pressure > threshold → separator issue
    
    return alarms
