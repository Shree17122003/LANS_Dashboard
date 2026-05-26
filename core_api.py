import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# CHANGE 1: Added "rack_count": 4 to the initial memory
sim_state = {
    "load": 20, 
    "temperature": 25.0, 
    "cooling_flow": 10.0, 
    "playing": False,
    "rack_count": 4
}

# CHANGE 2: Taught FastAPI to expect "rack_count" from React
class StateUpdate(BaseModel):
    load: int
    playing: bool
    rack_count: int = 4  # Default value 4 rakhi hai safety ke liye

@app.get("/state")
def get_state():
    return sim_state

@app.post("/update_state")
def update_state(data: StateUpdate):
    sim_state["load"] = data.load
    sim_state["playing"] = data.playing
    
    # CHANGE 3: Save the new rack_count into the memory
    sim_state["rack_count"] = data.rack_count
    
    # Rest of your math
    sim_state["temperature"] = 20.0 + (data.load * 0.6)
    sim_state["cooling_flow"] = data.load * 0.8
    return sim_state

if __name__ == "__main__":
    # SAFE PORT 9090
    uvicorn.run(app, host="0.0.0.0", port=9090)