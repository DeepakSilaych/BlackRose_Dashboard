import csv
import shutil
import asyncio
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
from fastapi import HTTPException

class CSVLock:
    def __init__(self):
        self._lock = asyncio.Lock()
        self._version = 1

    async def acquire(self):
        await self._lock.acquire()
        self._version += 1
        return self._version

    def release(self):
        self._lock.release()

csv_lock = CSVLock()

def ensure_data_dir():
    """Ensure the data directory exists."""
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    return data_dir

def backup_csv(csv_path: Path) -> Path:
    """Create a backup of the CSV file with timestamp."""
    ensure_data_dir()
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = csv_path.parent / f"{csv_path.stem}_backup_{timestamp}{csv_path.suffix}"
    
    # Create an empty file if source doesn't exist
    if not csv_path.exists():
        with open(csv_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['user', 'broker', 'API key', 'API secret', 'pnl', 'margin', 'max_risk'])
            writer.writeheader()
    
    shutil.copy2(csv_path, backup_path)
    return backup_path

async def read_csv(csv_path: Path) -> List[Dict]:
    """Read CSV file and return list of dictionaries."""
    ensure_data_dir()
    try:
        async with csv_lock._lock:
            if not csv_path.exists():
                # Create empty file with headers if it doesn't exist
                with open(csv_path, 'w', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=['user', 'broker', 'API key', 'API secret', 'pnl', 'margin', 'max_risk'])
                    writer.writeheader()
                return []
            
            with open(csv_path, 'r', newline='') as f:
                reader = csv.DictReader(f)
                return [row for row in reader]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV: {str(e)}")

async def write_csv(csv_path: Path, data: List[Dict]) -> None:
    """Write data to CSV file with locking and backup."""
    ensure_data_dir()
    try:
        version = await csv_lock.acquire()
        try:
            # Create backup
            backup_csv(csv_path)
            
            # Write new data
            fieldnames = ['user', 'broker', 'API key', 'API secret', 'pnl', 'margin', 'max_risk']
            with open(csv_path, 'w', newline='') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(data)
            
            return version
        finally:
            csv_lock.release()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error writing to CSV: {str(e)}")

async def update_csv_row(csv_path: Path, api_key: str, updates: Dict) -> Optional[Dict]:
    """Update a specific row in the CSV file."""
    ensure_data_dir()
    data = await read_csv(csv_path)
    
    for row in data:
        if row['API key'] == api_key:
            row.update(updates)
            await write_csv(csv_path, data)
            return row
            
    return None

async def delete_csv_row(csv_path: Path, api_key: str) -> bool:
    """Delete a specific row from the CSV file."""
    ensure_data_dir()
    data = await read_csv(csv_path)
    original_length = len(data)
    
    data = [row for row in data if row['API key'] != api_key]
    if len(data) < original_length:
        await write_csv(csv_path, data)
        return True
        
    return False
