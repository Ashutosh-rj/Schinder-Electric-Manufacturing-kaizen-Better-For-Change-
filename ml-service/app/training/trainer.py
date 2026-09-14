import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from xgboost import XGBRegressor
import structlog
from app.config import settings

logger = structlog.get_logger()

async def auto_train():
    logger.info("Starting auto training pipeline")
    
    os.makedirs(settings.MODEL_DIR, exist_ok=True)
    
    # 1. Health Score Model
    health_model_path = os.path.join(settings.MODEL_DIR, "health_model.joblib")
    if not os.path.exists(health_model_path):
        logger.info("Training health model...")
        # Synthetic data
        np.random.seed(42)
        n_samples = 1000
        
        vib = np.random.normal(2.0, 1.0, n_samples)
        pwr_dev = np.random.normal(0, 5, n_samples)
        temp_delta = np.random.normal(10, 3, n_samples)
        curr_dev = np.random.normal(0, 2, n_samples)
        op_hrs = np.random.uniform(100, 10000, n_samples)
        
        # Target: health score 0-100
        health = 100 - (vib * 5 + abs(pwr_dev) * 2 + temp_delta * 1)
        health = np.clip(health, 0, 100)
        
        df = pd.DataFrame({
            "vibration_rms": vib,
            "power_deviation_pct": pwr_dev,
            "temperature_delta": temp_delta,
            "current_deviation": curr_dev,
            "operating_hours": op_hrs
        })
        
        model = XGBRegressor(n_estimators=100, max_depth=3)
        model.fit(df, health)
        
        joblib.dump(model, health_model_path)
        logger.info("Health model saved.")
        
    # 2. Anomaly Models (per equipment, just do 1 for simplicity)
    anomaly_model_path = os.path.join(settings.MODEL_DIR, "anomaly_model_1.joblib")
    if not os.path.exists(anomaly_model_path):
        logger.info("Training anomaly model...")
        n_samples = 1000
        df = pd.DataFrame({
            "KILN-POWER": np.random.normal(2800, 50, n_samples),
            "KILN-BZT": np.random.normal(1420, 10, n_samples),
            "KILN-FEED": np.random.normal(280, 5, n_samples)
        })
        
        # Add anomalies
        df.loc[990:] = df.loc[990:] * 1.5
        
        iso = IsolationForest(contamination=0.01, random_state=42)
        iso.fit(df)
        
        joblib.dump(iso, anomaly_model_path)
        logger.info("Anomaly model saved.")
        
    logger.info("Auto training complete")
