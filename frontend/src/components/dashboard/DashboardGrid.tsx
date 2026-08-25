"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SensorCard } from "./SensorCard";
import { Thermometer, Droplets, Wind, Snowflake, Activity, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const initialData = {
  temperature: 22.0,
  humidity: 45.0,
  co2: 400.0,
  freezer_temp: -80.0,
  vibration: 0.0,
  energy_consumption: 1.0
};

export function DashboardGrid() {
  const [sensorData, setSensorData] = useState(initialData);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to FastAPI WebSocket
    const ws = new WebSocket("ws://localhost:8000/ws/sensors");

    ws.onopen = () => setIsConnected(true);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(data);
      } catch (error) {
        console.error("Error parsing websocket data:", error);
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = (error) => console.error("WebSocket Error:", error);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center text-sm">
        <span className="flex items-center gap-2 text-muted-foreground">
          <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}></span>
          {isConnected ? "Live Data Connected" : "Connecting to Server..."}
        </span>
      </div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <SensorCard 
          title="Lab Temperature" 
          value={sensorData.temperature} 
          unit="°C" 
          icon={Thermometer} 
          description="Normal condition" 
        />
        <SensorCard 
          title="Humidity" 
          value={sensorData.humidity} 
          unit="%" 
          icon={Droplets} 
          description="Optimal range" 
        />
        <SensorCard 
          title="CO2 Level" 
          value={sensorData.co2} 
          unit="ppm" 
          icon={Wind} 
          description="Air quality good" 
        />
        <SensorCard 
          title="Ultra-Low Freezer" 
          value={sensorData.freezer_temp} 
          unit="°C" 
          icon={Snowflake} 
          description="Critical: Maintaining temp" 
        />
        <SensorCard 
          title="Equipment Vibration" 
          value={sensorData.vibration} 
          unit="g" 
          icon={Activity} 
          description="Centrifuge operating normally" 
        />
        <SensorCard 
          title="Energy Consumption" 
          value={sensorData.energy_consumption} 
          unit="kW" 
          icon={Zap} 
          description="Current usage" 
        />
      </motion.div>
    </div>
  );
}
