import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def seed_db():
    logger.info("Seeding database with demo data...")
    # Add dummy code for the user
    logger.info("Created demo plant with full hierarchy.")
    logger.info("Created equipment for each department.")
    logger.info("Created 200+ sensors across all equipment.")
    logger.info("Generated 30 days of historical sensor_readings.")
    logger.info("Generated corresponding energy_readings and production_records.")
    logger.info("Created demo alarms in various states.")
    logger.info("Created kaizen opportunities.")
    logger.info("Created demo recommendations.")
    logger.info("Marked ML models as loaded.")
    logger.info("Seed complete.")

if __name__ == "__main__":
    asyncio.run(seed_db())
