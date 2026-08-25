"use client";

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

export function DashboardGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <SensorCard 
        title="Lab Temperature" 
        value={22.4} 
        unit="°C" 
        icon={Thermometer} 
        description="Normal condition" 
      />
      <SensorCard 
        title="Humidity" 
        value={45.2} 
        unit="%" 
        icon={Droplets} 
        description="Optimal range" 
      />
      <SensorCard 
        title="CO2 Level" 
        value={410} 
        unit="ppm" 
        icon={Wind} 
        description="Air quality good" 
      />
      <SensorCard 
        title="Ultra-Low Freezer" 
        value={-79.5} 
        unit="°C" 
        icon={Snowflake} 
        description="Critical: Maintaining temp" 
      />
      <SensorCard 
        title="Equipment Vibration" 
        value={0.12} 
        unit="g" 
        icon={Activity} 
        description="Centrifuge operating normally" 
      />
      <SensorCard 
        title="Energy Consumption" 
        value={1.4} 
        unit="kW" 
        icon={Zap} 
        description="Current usage" 
      />
    </motion.div>
  );
}
