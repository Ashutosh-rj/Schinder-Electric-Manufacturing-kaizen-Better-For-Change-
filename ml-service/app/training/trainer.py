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
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    health_model_path = os.path.join(settings.MODEL_DIR, "health_model.joblib")
    if not os.path.exists(health_model_path):
        logger.info("Training health model from historical data...")
        
        data_path = os.path.join(current_dir, "historical_health_data.csv")
        if not os.path.exists(data_path):
            logger.info("Historical data not found. Generating...")
            from app.training.generate_data import generate_csvs
            generate_csvs()
            
        df = pd.read_csv(data_path)
        y = df['health_score']
        X = df.drop(columns=['health_score'])
        
        model = XGBRegressor(n_estimators=100, max_depth=3)
        model.fit(X, y)
        
        joblib.dump(model, health_model_path)
        logger.info("Health model trained and saved.")
        
    # 2. Anomaly Models (per equipment, just do 1 for simplicity)
    anomaly_model_path = os.path.join(settings.MODEL_DIR, "anomaly_model_1.joblib")
    if not os.path.exists(anomaly_model_path):
        logger.info("Training anomaly model from historical data...")
        
        data_path = os.path.join(current_dir, "historical_anomaly_data.csv")
        if not os.path.exists(data_path):
            logger.error(f"Training failed. Missing dataset: {data_path}")
            return
            
        df = pd.read_csv(data_path)
        
        iso = IsolationForest(contamination=0.01, random_state=42)
        iso.fit(df)
        
        joblib.dump(iso, anomaly_model_path)
        logger.info("Anomaly model trained and saved.")
        
    logger.info("Auto training complete")
