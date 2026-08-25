import paho.mqtt.client as mqtt
import json
import asyncio
from websocket_manager import manager

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC = "biolab/sensors"

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode('utf-8')
        data = json.loads(payload)
        
        # Create a new event loop or use existing to broadcast async function
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(manager.broadcast(data))
        else:
            loop.run_until_complete(manager.broadcast(data))
            
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

def start_mqtt_client():
    try:
        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.loop_start()
    except Exception as e:
        print(f"Failed to connect to MQTT Broker: {e}")

def stop_mqtt_client():
    mqtt_client.loop_stop()
    mqtt_client.disconnect()
