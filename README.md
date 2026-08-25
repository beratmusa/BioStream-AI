# AI-Powered Smart Bioinformatics Laboratory

This project integrates IoT, AI, and Bioinformatics into a single cohesive platform.

## Architecture

* **Frontend**: Next.js (React, TypeScript, TailwindCSS) for real-time dashboard and FASTA sequence analysis.
* **Backend**: FastAPI (Python) for REST API and WebSockets.
* **Database**: PostgreSQL with TimescaleDB for time-series data storage.
* **IoT Simulator**: Python-based mock sensors publishing data via MQTT.
* **Message Broker**: Eclipse Mosquitto (MQTT).
* **ML/Data Science**: Biopython for sequence analysis, scikit-learn for anomaly detection and classification.

## Folder Structure

* `/frontend`: Next.js web dashboard.
* `/backend`: FastAPI application and database models.
* `/iot_simulator`: Python scripts for simulating IoT sensor data.
* `/ml_models`: Jupyter notebooks and scripts for model training.
* `/mosquitto`: Configuration and data for the MQTT broker.
* `docker-compose.yml`: Infrastructure definition.

## Getting Started

1. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```

2. **Run Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Run IoT Simulator**:
   ```bash
   cd iot_simulator
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python simulator.py
   ```

4. **Run Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

## Agents

The following subagents have been defined for this project to help develop specific components:
* `frontend_dev`: Next.js & UI/UX expert.
* `backend_dev`: FastAPI, Database (TimescaleDB), MQTT expert.
* `iot_engineer`: Python IoT simulator & MQTT expert.
* `data_scientist`: Bioinformatics (Biopython) & ML (Anomaly Detection, DNA Classification) expert.
