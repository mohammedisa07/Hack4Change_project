import paho.mqtt.client as mqtt
import json

# MQTT Configuration
MQTT_BROKER = 'your_mqtt_broker_address'
MQTT_PORT = 1883
MQTT_TOPIC = 'sensor/data'

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    data = msg.payload.decode()
    print("Received data: ", json.loads(data))

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_forever()
