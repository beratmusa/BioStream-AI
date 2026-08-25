import paho.mqtt.client as mqtt
import json
import asyncio
from websocket_manager import manager

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC = "biolab/sensors"

main_loop = None

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    client.subscribe(TOPIC)

async def process_and_save_data(data: dict):
    from database import AsyncSessionLocal
    from models import SensorData
    
    try:
        # 1. Save to Database
        async with AsyncSessionLocal() as session:
            new_record = SensorData(
                temperature=data.get("temperature", 0.0),
                humidity=data.get("humidity", 0.0),
                co2=data.get("co2", 0.0),
                freezer_temp=data.get("freezer_temp", 0.0),
                vibration=data.get("vibration", 0.0),
                energy_consumption=data.get("energy_consumption", 0.0)
            )
            session.add(new_record)
            await session.commit()
            
        # 2. Broadcast to WebSockets
        await manager.broadcast(data)
    except Exception as e:
        print(f"Error saving to DB: {e}")

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode('utf-8')
        data = json.loads(payload)
        
        if main_loop and main_loop.is_running():
            asyncio.run_coroutine_threadsafe(process_and_save_data(data), main_loop)
            
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt_client():
    global main_loop
    try:
        main_loop = asyncio.get_running_loop()
    except RuntimeError:
        main_loop = None
        
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.loop_start()
    except Exception as e:
        print(f"Failed to connect to MQTT Broker: {e}")

def stop_mqtt_client():
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
