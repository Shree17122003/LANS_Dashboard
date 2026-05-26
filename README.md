# Livio Digital Twin Project

## Project Overview
An automated infrastructure simulation pipeline for data centers, utilizing NVIDIA Omniverse for real-time physics rendering and FastAPI for command orchestration.

## How It Works
1. **Frontend:** React-based dashboard sends configuration (JSON) to the backend.
2. **Backend (FastAPI):** Validates the design against NVIDIA DSX standards and triggers Omniverse commands.
3. **Omniverse Engine:** The Kit SDK processes the blueprint and renders the physics-compliant digital twin.

## Running with Omniverse
To link this project with Omniverse:
1. Open **Omniverse Kit SDK**.
2. Open the **Script Editor** (Window > Script Editor).
3. Paste the connection bridge script (below) and press "Play".

## Omniverse Script Editor Code (Connection Bridge)
This script allows your FastAPI backend to talk to the running Omniverse scene:

```python
import omni.kit
import asyncio
from fastapi import FastAPI
import uvicorn

# Omniverse Connection Bridge
async def run_server():
    app = FastAPI()

    @app.get("/update_camera/{camera_name}")
    async def update_camera(camera_name: str):
        # Logic to switch viewport camera
        return {"status": "success", "camera": camera_name}

    config = uvicorn.Config(app, port=8000, log_level="info")
    server = uvicorn.Server(config)
    await server.serve()

# Execute in Script Editor
asyncio.ensure_future(run_server())
print("FastAPI Bridge initialized. Dashboard connected.")
