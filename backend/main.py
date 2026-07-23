import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import hospitals, regions, equipment, kpis

app = FastAPI(title="Radiology & Diagnostic Imaging Capacity Planner")

# Support comma-separated CORS origins from environment with a safe local fallback
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hospitals.router, prefix="/api")
app.include_router(regions.router, prefix="/api")
app.include_router(equipment.router, prefix="/api")
app.include_router(kpis.router, prefix="/api")

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "project": "Radiology Capacity Planner",
        "data_source": "synthetic_mock"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
