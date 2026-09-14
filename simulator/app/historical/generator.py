import datetime
import asyncpg
import asyncio
from app.config import settings
from app.scenarios import get_scenario

async def generate_historical_data():
    conn = await asyncpg.connect(settings.DATABASE_URL)
    
    # Create table if not exists
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS plant_telemetry (
            timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
            tag VARCHAR(50) NOT NULL,
            value FLOAT,
            quality VARCHAR(20),
            unit VARCHAR(20)
        )
    ''')
    
    # 30 days back
    end_time = datetime.datetime.utcnow()
    start_time = end_time - datetime.timedelta(days=30)
    
    scenario = get_scenario("normal")
    current_time = start_time
    
    interval = datetime.timedelta(minutes=5) # 5 min intervals for history to save space
    
    records = []
    
    while current_time < end_time:
        readings = scenario.step()
        for r in readings:
            records.append((
                current_time,
                r['tag'],
                r['value'],
                r['quality'],
                r['unit']
            ))
            
        if len(records) >= 10000:
            await conn.copy_records_to_table(
                'plant_telemetry',
                records=records,
                columns=['timestamp', 'tag', 'value', 'quality', 'unit']
            )
            records = []
            
        current_time += interval
        
    if records:
        await conn.copy_records_to_table(
            'plant_telemetry',
            records=records,
            columns=['timestamp', 'tag', 'value', 'quality', 'unit']
        )
        
    await conn.close()
    
if __name__ == "__main__":
    asyncio.run(generate_historical_data())
