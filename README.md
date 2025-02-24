# BlackRose Trading Dashboard

A modern, responsive trading dashboard built with React and FastAPI, featuring real-time data visualization, user authentication, and API key management.

## Quick Start

### Backend Setup

1. Navigate to backend directory and create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

1. Navigate to frontend directory and install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

## Testing Guide

### Authentication

Test accounts available:
- Demo Account:
  - Username: demo_user
  - Password: demo123
- Test Account:
  - Username: test_user
  - Password: test123

Features to test:
1. Login with test accounts
2. Register new account
3. Verify error handling

### Data Visualization

1. Real-time Chart:
   - Verify live updates
   - Check responsiveness
   - Validate data accuracy

2. Performance Metrics:
   - Total PNL
   - Total Margin
   - Total Risk
   - Active Users

### API Key Management

1. Create new API key
2. Update existing key
3. Delete key
4. Verify changes in table

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
blackrose/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app
│   │   ├── auth.py        # Authentication
│   │   ├── models.py      # Database models
│   │   └── database.py    # DB config
│   └── data/             # Data storage
└── frontend/
    └── src/
        ├── components/   # React components
        ├── store/       # Redux store
        └── App.js       # Main app
# BlackRose_Dashboard
# BlackRose_Dashboard
