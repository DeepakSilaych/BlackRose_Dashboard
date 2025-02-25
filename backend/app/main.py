from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from pathlib import Path
from pydantic import BaseModel
import json
import asyncio
import random
from .database import get_db, engine
from .auth import authenticate_user, create_access_token, get_current_user, get_password_hash, get_user
from .models import Base, User, Session, RandomNumber, BackendTableEntry, PerformanceData
from .background_tasks import generate_random_numbers
from .csv_handler import read_csv, write_csv, update_csv_row, delete_csv_row, csv_lock, backup_csv, ensure_data_dir
from .services import PerformanceService
import shutil
from fastapi.responses import FileResponse

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origin_regex=r"^http://localhost:\d+$",  # Allow WebSocket connections
)

# Path to the CSV file
CSV_PATH = Path("/home/deepak-silaych/Desktop/blackrose/backend/data/backend_table.csv")

class UserCreate(BaseModel):
    username: str
    password: str

# Initialize performance service
performance_service = PerformanceService()

@app.on_event("startup")
async def startup_event():
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Start random number generator
    async for db in get_db():
        asyncio.create_task(generate_random_numbers(db))
        break
    
    # Start performance service with a new database session
    async for db in get_db():
        await performance_service.start(db)
        break

@app.on_event("shutdown")
async def shutdown_event():
    await performance_service.stop()

@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    # Store session
    session = Session(
        username=user.username,
        token=access_token,
        expires_at=datetime.utcnow() + access_token_expires
    )
    db.add(session)
    await db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.websocket("/ws/random-numbers")
async def websocket_random_numbers(
    websocket: WebSocket,
    db: AsyncSession = Depends(get_db)
):
    await websocket.accept()
    try:
        while True:
            # Get latest random number
            result = await db.execute(
                select(RandomNumber)
                .order_by(RandomNumber.timestamp.desc())
                .limit(1)
            )
            number = result.scalar_one_or_none()
            
            if number:
                await websocket.send_json({
                    "timestamp": number.timestamp.isoformat(),
                    "value": number.value
                })
            
            await asyncio.sleep(1)
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/api/csv")
async def get_csv_data(current_user: str = Depends(get_current_user)):
    """Fetch the CSV file data."""
    return await read_csv(CSV_PATH)

@app.post("/api/csv")
async def create_csv_entry(
    entry: Dict,
    current_user: str = Depends(get_current_user)
):
    """Create a new entry in the CSV file."""
    data = await read_csv(CSV_PATH)
    
    # Check for duplicate API key
    if any(row['API key'] == entry['API key'] for row in data):
        raise HTTPException(status_code=400, detail="API key already exists")
    
    data.append(entry)
    version = await write_csv(CSV_PATH, data)
    return {"message": "Entry created", "version": version}

@app.put("/api/csv/{api_key}")
async def update_csv_entry(
    api_key: str,
    updates: Dict,
    current_user: str = Depends(get_current_user)
):
    """Update an entry in the CSV file."""
    updated_row = await update_csv_row(CSV_PATH, api_key, updates)
    if not updated_row:
        raise HTTPException(status_code=404, detail="Entry not found")
    return updated_row

@app.delete("/api/csv/{api_key}")
async def delete_csv_entry(
    api_key: str,
    current_user: str = Depends(get_current_user)
):
    """Delete an entry from the CSV file."""
    success = await delete_csv_row(CSV_PATH, api_key)
    if not success:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry deleted"}

@app.get("/")
async def root():
    return {"message": "BlackRose API is running"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Message received: {data}")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@app.post("/register")
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Register a new user."""
    # Check if username already exists
    existing_user = await get_user(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(username=user_data.username, hashed_password=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Create and return access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username
    }

@app.get("/dummy-credentials")
async def get_dummy_credentials():
    """Get dummy credentials for testing."""
    return {
        "credentials": [
            {
                "username": "demo_user",
                "password": "demo123",
                "note": "Demo Account"
            },
            {
                "username": "test_user",
                "password": "test123",
                "note": "Test Account"
            }
        ]
    }

@app.websocket("/ws/performance")
async def websocket_performance(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    await websocket.accept()
    
    try:
        # Send initial dataset (last 50 points)
        historical_data = await performance_service.get_recent_data(db)
        initial_data = [
            {
                "timestamp": data.timestamp.isoformat(),
                "value": data.value
            }
            for data in historical_data
        ]
        await websocket.send_json(initial_data)  # Send as array for initial dataset
        
        # Subscribe to real-time updates
        performance_service.subscribe(websocket)
        
        # Keep connection alive
        while True:
            try:
                await websocket.receive_text()  # Keep connection alive
            except WebSocketDisconnect:
                break
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        performance_service.unsubscribe(websocket)

# Backup management endpoints
@app.get("/api/backups", response_model=List[str])
async def list_backups(current_user: str = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """List all available CSV backups."""
    try:
        data_dir = ensure_data_dir()
        csv_path = data_dir / "backend_table.csv"
        backup_pattern = f"{csv_path.stem}_backup_*{csv_path.suffix}"
        backups = sorted(csv_path.parent.glob(backup_pattern), reverse=True)
        return [backup.name for backup in backups]
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing backups: {str(e)}"
        )

@app.post("/api/backups/{backup_name}/restore")
async def restore_backup(
    backup_name: str,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Restore from a specific backup."""
    try:
        data_dir = ensure_data_dir()
        csv_path = data_dir / "backend_table.csv"
        backup_path = csv_path.parent / backup_name
        
        if not backup_path.exists():
            raise HTTPException(status_code=404, detail="Backup not found")
        
        # Create a backup of current state before restore
        version = await csv_lock.acquire()
        try:
            current_backup = backup_csv(csv_path)
            shutil.copy2(backup_path, csv_path)
            return {
                "message": "Backup restored successfully",
                "current_backup": current_backup.name,
                "version": version
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error during restore: {str(e)}"
            )
        finally:
            csv_lock.release()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error restoring backup: {str(e)}"
        )

@app.get("/api/backups/{backup_name}/download")
async def download_backup(
    backup_name: str,
    current_user: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Download a specific backup."""
    try:
        data_dir = ensure_data_dir()
        csv_path = data_dir / "backend_table.csv"
        backup_path = csv_path.parent / backup_name
        
        if not backup_path.exists():
            raise HTTPException(status_code=404, detail="Backup not found")
        
        return FileResponse(
            backup_path,
            media_type="text/csv",
            filename=backup_path.name,
            headers={"Cache-Control": "no-cache"}
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error downloading backup: {str(e)}"
        )
