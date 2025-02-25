import asyncio
import random
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from .models import PerformanceData
from .database import get_db

class PerformanceService:
    def __init__(self):
        self.subscribers = set()
        self._running = False
        self._task = None

    async def start(self, db: AsyncSession):
        if self._running:
            return
        
        self._running = True
        self._task = asyncio.create_task(self._generate_performance_data())

    async def stop(self):
        if not self._running:
            return
        
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
            self._task = None

    def subscribe(self, websocket):
        self.subscribers.add(websocket)

    def unsubscribe(self, websocket):
        self.subscribers.discard(websocket)

    async def _generate_performance_data(self):
        while self._running:
            try:
                # Create a new database session for each iteration
                async for db in get_db():
                    try:
                        # Generate new performance data
                        value = random.uniform(0, 100)
                        timestamp = datetime.utcnow()

                        # Store in database
                        new_data = PerformanceData(timestamp=timestamp, value=value)
                        db.add(new_data)
                        await db.commit()

                        # Clean up old data (keep last 50 points)
                        stmt = select(PerformanceData).order_by(PerformanceData.timestamp.desc()).offset(50)
                        result = await db.execute(stmt)
                        old_records = result.scalars().all()
                        if old_records:
                            stmt = delete(PerformanceData).where(PerformanceData.id.in_([r.id for r in old_records]))
                            await db.execute(stmt)
                            await db.commit()

                        # Broadcast to all subscribers
                        message = {
                            "timestamp": timestamp.isoformat(),
                            "value": value
                        }
                        dead_connections = set()
                        for websocket in self.subscribers:
                            try:
                                await websocket.send_json(message)
                            except:
                                dead_connections.add(websocket)

                        # Remove dead connections
                        for websocket in dead_connections:
                            self.unsubscribe(websocket)

                        break  # Exit the database session loop
                    except Exception as e:
                        print(f"Error in database operation: {e}")
                        await db.rollback()
                        break

                await asyncio.sleep(1)  # Generate data every second

            except Exception as e:
                print(f"Error in performance data generation: {e}")
                await asyncio.sleep(1)  # Wait before retrying

    async def get_recent_data(self, db: AsyncSession, limit: int = 50):
        stmt = select(PerformanceData).order_by(PerformanceData.timestamp.desc()).limit(limit)
        result = await db.execute(stmt)
        data = result.scalars().all()
        return sorted(data, key=lambda x: x.timestamp)  # Sort by timestamp ascending
