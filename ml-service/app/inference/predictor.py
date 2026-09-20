import os
import joblib
import pandas as pd
import numpy as np
import shap
from typing import Dict, List, Any
from app.config import settings

def load_model(name: str):
    path = os.path.join(settings.MODEL_DIR, f"{name}.joblib")
    if os.path.exists(path):
        return joblib.load(path)
    return None

def get_health_score(equipment_id: int, features: Dict[str, float]) -> Dict[str, Any]:
    model = load_model("health_model")
    if not model:
        # Fallback dummy prediction if model not trained yet
        return {
            "equipment_id": equipment_id,
            "health_score": 85.0,
            "confidence": 0.5,
            "risk_level": "LOW",
            "shap_values": {"vibration_rms": 0.1, "power_deviation_pct": 0.1},
            "model_version": "v0.0",
            "disclaimer": "PREDICTED - NO MODEL FOUND"
        }
        
    df = pd.DataFrame([features])
    score = model.predict(df)[0]
    
    # SHAP
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df)
    
    # Map top shap values
    feature_names = list(features.keys())
    shap_dict = {feature_names[i]: float(shap_values[0][i]) for i in range(len(feature_names))}
    top_shap = dict(sorted(shap_dict.items(), key=lambda item: abs(item[1]), reverse=True)[:3])
    
    risk_level = "LOW"
    if score < 60: risk_level = "HIGH"
    elif score < 80: risk_level = "MEDIUM"

    return {
        "equipment_id": equipment_id,
        "health_score": round(float(score), 2),
        "confidence": 0.92,
        "risk_level": risk_level,
        "shap_values": top_shap,
        "model_version": "v1.0",
        "disclaimer": "PREDICTED - SIMULATED DATA"
    }

def get_anomaly(equipment_id: int, readings: List[Dict[str, Any]]) -> Dict[str, Any]:
    model = load_model(f"anomaly_model_{equipment_id}")
    if not model:
        return {
            "equipment_id": equipment_id,
            "is_anomaly": False,
            "anomaly_score": 0.0,
            "confidence": 0.5,
            "contributing_features": [],
            "disclaimer": "PREDICTED - NO MODEL FOUND"
        }
        
    # parse readings to dict
    feature_dict = {r['tag']: r['value'] for r in readings if isinstance(r['value'], (int, float))}
    df = pd.DataFrame([feature_dict])
    
    # we need same features as trained, missing values handled
    pred = model.predict(df)[0]
    score = model.score_samples(df)[0]
    
    is_anomaly = pred == -1
    
    return {
        "equipment_id": equipment_id,
        "is_anomaly": bool(is_anomaly),
        "anomaly_score": float(score),
        "confidence": 0.85,
        "contributing_features": list(feature_dict.keys())[:2], # placeholder for IF explainer
        "disclaimer": "PREDICTED"
    }
    
def get_failure_risk(equipment_id: int, features: Dict[str, float]) -> Dict[str, Any]:
    # Dummy logic matching request shape, combining health
    health = get_health_score(equipment_id, features)
    score = health['health_score']
    risk = max(0, 100 - score) / 100.0
    
    # Extract factors dynamically from SHAP
    shap_vals = health.get('shap_values', {})
    top_factors = [
        {"factor": f"{k.replace('_', ' ').title()}", "contribution": round(abs(v), 2)}
        for k, v in shap_vals.items()
    ]
    if not top_factors:
        top_factors = [{"factor": "No model data available", "contribution": 0.0}]
    
    return {
        "equipment_id": equipment_id,
        "failure_risk_score": float(risk),
        "risk_level": health['risk_level'],
        "estimated_rul_days": int(score * 0.5),
        "top_factors": top_factors,
        "confidence": health['confidence'],
        "disclaimer": health['disclaimer']
    }
