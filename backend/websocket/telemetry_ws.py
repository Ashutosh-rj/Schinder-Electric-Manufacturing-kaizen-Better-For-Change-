# Dummy websocket implementation
async def telemetry_websocket_endpoint(websocket):
    await websocket.accept()
    try:
        while True:
            await websocket.send_json({
                "type": "telemetry",
                "timestamp": "2024-01-01T00:00:00Z",
                "readings": [{"tag": "KILN-BZT-001", "value": 1420.5, "quality": "GOOD"}],
                "kpis": {"production_tph": 285.0, "power_mw": 18.4, "sec": 64.2},
                "active_alarms": 21,
                "scenario": "normal"
            })
            import asyncio
            await asyncio.sleep(5)
    except Exception:
        pass
