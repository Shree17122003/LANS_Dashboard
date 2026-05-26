import omni.kit.app
import omni.usd
import omni.timeline
from pxr import UsdGeom, Gf
import urllib.request
import json
import threading

# CONFIG
BASE_PATH = "/World/DATACENTER_VFX" 
SMOKE_PATH = "/World/PRO_COOLING_ROUTING/Smoke_VFX"

class livio_DigitalTwin:
    def __init__(self):
        self.load = 20
        self.playing = False
        self.frame = 0
        self.sub = omni.kit.app.get_app_interface().get_update_event_stream().create_subscription_to_pop(self.on_update)
        print("✅ RECONNECTED: Engine listening to Port 9090")

    def fetch_api(self):
        try:
            with urllib.request.urlopen("http://localhost:9090/state", timeout=0.5) as res:
                data = json.loads(res.read().decode())
                self.load = data.get("load", 20)
                self.playing = data.get("playing", False)
        except: pass

    def on_update(self, e):
        self.frame += 1
        stage = omni.usd.get_context().get_stage()
        timeline = omni.timeline.get_timeline_interface()

        if self.frame % 30 == 0:
            threading.Thread(target=self.fetch_api).start()

        # Dashboard ke button se Omniverse ka Play button sync hoga
        if self.playing and not timeline.is_playing():
            timeline.play()
        elif not self.playing and timeline.is_playing():
            timeline.pause()

        # LED Blinking
        if self.playing:
            parent = stage.GetPrimAtPath(BASE_PATH)
            if parent.IsValid():
                for prim in parent.GetChildren():
                    if "Server_LED" in prim.GetName() or "Energy_Pulse" in prim.GetName():
                        rate = max(2, int(20 - (self.load / 10)))
                        is_vis = (self.frame % rate) > (rate / 2)
                        UsdGeom.Imageable(prim).GetVisibilityAttr().Set("inherited" if is_vis else "invisible")

if "livio_twin" in globals(): livio_twin = None
livio_twin = livio_DigitalTwin()