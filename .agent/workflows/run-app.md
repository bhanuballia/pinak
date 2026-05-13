---
description: How to run the Vedic Astrology App
---

To run the application, follow these steps:

### 1. Run the Backend
From the root directory (`d:\vedic-astrology-app`):

// turbo
```powershell
.\venv\Scripts\python.exe -m uvicorn api.main:app --reload --port 8000
```
> [!NOTE]
> Using `.\venv\Scripts\python.exe -m uvicorn` ensures that the correct virtual environment is used even if not explicitly activated. The backend will be available at `http://127.0.0.1:8000`.

### 2. Run the Frontend
Open a new terminal and navigate to the frontend directory (`d:\vedic-astrology-app\frontend`):

// turbo
```powershell
npm run dev
```
> [!NOTE]
> The frontend will be available at `http://localhost:5173`. It is configured to proxy API requests to the backend on port 8000.
