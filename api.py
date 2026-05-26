from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Yeh CORS zaroori hai taaki dashboard isse baat kar sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Yeh humara "Postbox" ka data hai
sim_state = {
    "load": 20, 
    "temperature": 25.0, 
    "cooling_flow": 10.0, 
    "playing": False
}

class StateUpdate(BaseModel):
    load: int
    playing: bool

# YEH RASTA MISSING THA (The /state endpoint)
@app.get("/state")
def get_state():
    return sim_state

@app.post("/update_state")
def update_state(data: StateUpdate):
    sim_state["load"] = data.load
    sim_state["playing"] = data.playing
    sim_state["temperature"] = 20.0 + (data.load * 0.6)
    sim_state["cooling_flow"] = data.load * 0.8
    return sim_state