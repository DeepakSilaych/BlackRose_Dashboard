import asyncio
import random
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from . import models

async def generate_random_numbers(db: AsyncSession):
    """Generate and store random numbers every second."""
    while True:
        try:
            # Generate random number
            number = random.uniform(-100, 100)
            
            # Store in database
            random_number = models.RandomNumber(
                timestamp=datetime.utcnow(),
                value=number
            )
            db.add(random_number)
            await db.commit()
            
            # Wait for 1 second
            await asyncio.sleep(1)
            
        except Exception as e:
            print(f"Error in random number generation: {e}")
            await asyncio.sleep(1)  # Wait before retrying
