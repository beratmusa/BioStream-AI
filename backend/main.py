from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from websocket_manager import manager
from mqtt_client import start_mqtt_client, stop_mqtt_client
import uvicorn
from bio_analyzer import extract_features

app = FastAPI(title="BioStream AI API", version="1.0.0")

# Allow CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Initializing Database...")
    from database import engine, Base
    import models  # Important: import models so Base.metadata registers the tables
    async with engine.begin() as conn:
        # Note: In production use Alembic for migrations
        await conn.run_sync(Base.metadata.create_all)
        
    print("Starting MQTT Client...")
    start_mqtt_client()

@app.on_event("shutdown")
async def shutdown_event():
    print("Stopping MQTT Client...")
    stop_mqtt_client()

@app.get("/")
async def root():
    return {"message": "Welcome to BioStream AI API"}

@app.post("/api/analyze-fasta")
async def analyze_fasta(file: UploadFile = File(...)):
    if not file.filename.endswith(('.fasta', '.fa', '.txt')):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a FASTA file.")
    
    try:
        content = await file.read()
        text_content = content.decode("utf-8")
        results = extract_features(text_content)
        return {"status": "success", "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/ws/sensors")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive, listen for any messages from client if needed
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
