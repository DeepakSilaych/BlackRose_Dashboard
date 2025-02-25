# BlackRose Dashboard

- Frontend: https://blackrose.deepaksilaych.me
- Backend: https://blackroseb.deepaksilaych.me

## API Documentation

- Swagger UI: https://blackroseb.deepaksilaych.me/docs
- ReDoc: https://blackroseb.deepaksilaych.me/redoc


## Features

- Real-time performance data visualization
- JWT-based authentication
- CRUD operations for data management
- Backup and restore functionality
- Dark theme UI with Material Design
- WebSocket-based live updates
- Concurrency handling

## Local Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`



## Testing Guide

### Authentication

1. Access the login page at `/`
2. Use the provided dummy credentials or create a new account
3. Verify that:
   - JWT token is stored in localStorage
   - Protected routes are accessible
   - Unauthorized access is blocked

### Data Visualization

1. After login, observe the performance chart
2. Verify:
   - Real-time data updates via WebSocket
   - Proper scaling and axes

### CRUD Operations

1. Navigate to the data table
2. Test the following:
   - Create: Add new entries with broker details
   - Read: View existing entries and search functionality
   - Update: Modify broker information
   - Delete: Remove entries
   - Verify concurrency handling

### Backup Management

1. Access the backup manager
2. Test:
   - Creating backups
   - Listing available backups
   - Downloading backup files
   - Restoring from backups
   - Error handling during restore

