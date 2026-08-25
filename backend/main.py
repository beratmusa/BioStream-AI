from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from websocket_manager import manager
from mqtt_client import start_mqtt_client, stop_mqtt_client
import uvicorn

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
    print("Starting MQTT Client...")
    start_mqtt_client()

@app.on_event("shutdown")
async def shutdown_event():
    print("Stopping MQTT Client...")
    stop_mqtt_client()

@app.get("/")
async def root():
    return {"message": "Welcome to BioStream AI API"}

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
