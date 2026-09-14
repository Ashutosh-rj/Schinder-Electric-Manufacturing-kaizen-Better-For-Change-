"""
Anomaly Service
Detects anomalies using Statistical methods (EWMA, Z-Score) + Engineering Rules.
"""
def detect_anomalies(telemetry_window):
    anomalies = []
    return anomalies

def detect_frozen_sensors(readings: dict) -> list:
    """Flag sensors with no change > 30 min while process running"""
    anomalies = []
    # Mock logic
    for tag, data in readings.items():
        if data.get('frozen_minutes', 0) > 30 and data.get('process_running', True):
            anomalies.append({
                "sensor_tag": tag,
                "type": "FROZEN",
                "frozen_duration_minutes": data['frozen_minutes'],
                "severity": "MEDIUM",
                "recommended_action": "Check transmitter and impulse lines"
            })
    return anomalies

def detect_rate_of_change_violations(readings: dict, limits: dict) -> list:
    """Rapid changes"""
    anomalies = []
    for tag, data in readings.items():
        roc = data.get('rate_of_change_per_min', 0)
        limit = limits.get(tag, 100)
        if abs(roc) > limit:
            anomalies.append({
                "sensor_tag": tag,
                "type": "RATE_OF_CHANGE",
                "severity": "HIGH",
                "recommended_action": "Verify process stability or sensor health"
            })
    return anomalies

def detect_envelope_violations(readings: dict, windows: dict) -> list:
    """Out of operating window"""
    anomalies = []
    for tag, value in readings.items():
        if tag in windows:
            if not (windows[tag]['low'] <= value <= windows[tag]['high']):
                anomalies.append({
                    "sensor_tag": tag,
                    "type": "ENVELOPE",
                    "severity": "MEDIUM",
                    "recommended_action": "Adjust operating parameters to bring back in envelope"
                })
    return anomalies

def detect_statistical_anomalies(readings: dict, history: dict) -> list:
    """3-sigma"""
    anomalies = []
    for tag, value in readings.items():
        if tag in history:
            mean = history[tag]['mean']
            std = history[tag]['std']
            if std > 0 and abs(value - mean) > 3 * std:
                anomalies.append({
                    "sensor_tag": tag,
                    "type": "STATISTICAL",
                    "deviation_sigma": abs(value - mean) / std,
                    "severity": "HIGH",
                    "recommended_action": "Investigate 3-sigma deviation"
                })
    return anomalies
