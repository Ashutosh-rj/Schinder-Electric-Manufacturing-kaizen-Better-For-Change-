import pandas as pd
import numpy as np
import os

def generate_csvs():
    np.random.seed(42)
    n_samples = 5000

    # Base normal state
    vib = np.random.normal(1.5, 0.3, n_samples)
    pwr_dev = np.random.normal(0, 1.5, n_samples)
    temp_delta = np.random.normal(5, 1, n_samples)
    curr_dev = np.random.normal(0, 0.5, n_samples)
    op_hrs = np.linspace(100, 12000, n_samples)

    # Induce degradation over time
    degradation_factor = (op_hrs / 12000) ** 2
    vib += degradation_factor * 4.5
    temp_delta += degradation_factor * 8
    pwr_dev += degradation_factor * 3

    # Target health score (0-100) - Real formula proxy
    health = 100 - (vib * 8 + abs(pwr_dev) * 2.5 + temp_delta * 1.5)
    health = np.clip(health, 0, 100)

    df_health = pd.DataFrame({
        'vibration_rms': vib,
        'power_deviation_pct': pwr_dev,
        'temperature_delta': temp_delta,
        'current_deviation': curr_dev,
        'operating_hours': op_hrs,
        'health_score': health
    })
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    df_health.to_csv(os.path.join(current_dir, 'historical_health_data.csv'), index=False)

    # Anomaly Data
    df_anomaly = pd.DataFrame({
        'KILN-POWER': np.random.normal(2800, 50, n_samples),
        'KILN-BZT': np.random.normal(1420, 10, n_samples),
        'KILN-FEED': np.random.normal(280, 5, n_samples)
    })
    df_anomaly.loc[4950:] = df_anomaly.loc[4950:] * 1.25 # Inject anomalies
    df_anomaly.to_csv(os.path.join(current_dir, 'historical_anomaly_data.csv'), index=False)
    
    print("Historical data CSVs generated successfully.")

if __name__ == "__main__":
    generate_csvs()
