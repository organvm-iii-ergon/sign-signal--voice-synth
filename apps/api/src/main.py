"""
Sign Signal API — Speech Score Engine Layer 1
FastAPI backend for Dialogue Looping Tracker Sequence
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Sign Signal API",
    description="Dialogue Looping Tracker Sequence API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "Sign Signal API",
        "version": "0.1.0",
        "description": "Dialogue Looping Tracker Sequence — Layer 1",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
