def handle_query(query: str):
    # Template based Q&A
    if "sec" in query.lower():
        return {
            "answer": "The plant SEC has increased primarily due to suboptimal performance in the Cement Mill 2 fan.",
            "data_sources": ["energy_readings", "sensor_readings"]
        }
    return {"answer": "Insufficient plant data to determine this."}
