import time
import json
import paho.mqtt.client as mqtt
import random

MQTT_BROKER = "localhost"
MQTT_PORT = 1883
TOPIC = "biolab/sensors"

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

client = mqtt.Client()
client.on_connect = on_connect

client.connect(MQTT_BROKER, MQTT_PORT, 60)

client.loop_start()

try:
    while True:
        sensor_data = {
            "temperature": round(random.uniform(20.0, 25.0), 2),
            "humidity": round(random.uniform(30.0, 50.0), 2),
            "co2": round(random.uniform(400.0, 600.0), 2),
            "freezer_temp": round(random.uniform(-80.0, -78.0), 2),
            "vibration": round(random.uniform(0.0, 0.5), 2),
            "energy_consumption": round(random.uniform(1.0, 2.0), 2),
        }
        print(f"Publishing: {sensor_data}")
        client.publish(TOPIC, json.dumps(sensor_data))
        time.sleep(5)
except KeyboardInterrupt:
    print("Stopping simulator...")
    client.loop_stop()
    client.disconnect()
