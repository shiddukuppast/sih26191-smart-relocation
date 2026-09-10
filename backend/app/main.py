from fastapi import FastAPI

from app.api.routes.relocation import router as relocation_router


app = FastAPI(
    title="Disaster Relocation Intelligence API",
    version="1.0.0",
)


app.include_router(relocation_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "Disaster Relocation Intelligence API",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }