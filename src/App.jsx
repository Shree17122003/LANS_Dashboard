import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  // --- 1. SYSTEM STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'sop'
  
  const [state, setState] = useState({
    load: 20,
    playing: false,
  });

  const [datacenter, setDatacenter] = useState({
    rackCount: 4,
    kwPerRack: 30
  });

  const [logs, setLogs] = useState(["[SYSTEM INITIATED] LIVIO Engine Online. Monitoring Core API..."]);
  const logEndRef = useRef(null);

  // --- 2. KINEMATICS & MATH ---
  const totalCapacityKW = datacenter.rackCount * datacenter.kwPerRack;
  const currentUsageKW = (state.load / 100) * totalCapacityKW;
  const coolantFlowLS = state.load * 1.2; 
  const isDanger = state.load > 85; 

  // --- 3. LOGIC FUNCTIONS ---
  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${time}] ${message}`]);
  };

  const sendUpdate = (newLoad, newPlaying) => {
    if (newPlaying !== state.playing) {
      addLog(newPlaying ? "SYSTEM ACTIVATED: Cooling pumps engaged." : "SYSTEM DEACTIVATED: Entering standby.");
    }
    if (Math.abs(newLoad - state.load) > 10) {
      addLog(`Load shifted to ${newLoad}%. Adjusting 3D twin parameters.`);
    }

    setState({ load: newLoad, playing: newPlaying });

    fetch('http://localhost:9090/update_state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load: newLoad, playing: newPlaying })
    }).catch(err => console.error("API Error:", err));
  };

  const handleAddRack = () => {
    const newCount = datacenter.rackCount + 1;
    setDatacenter(prev => ({ ...prev, rackCount: newCount }));
    addLog(`DEPLOYMENT: Executing 'CreateMdlMaterialPrimCommand'. Injecting Rack 0${newCount} from Nucleus.`);
    
    fetch('http://localhost:9090/update_state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ load: state.load, playing: state.playing, rack_count: newCount })
    }).catch(err => console.error("API Error:", err));
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  // --- 4. SOP BLUEPRINT COMPONENT ---
  const RenderSOP = () => (
    <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '8px', border: '1px solid #1e293b', color: '#cbd5e1' }}>
      
      <div style={{ borderBottom: '2px solid #38bdf8', paddingBottom: '15px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '2rem' }}>LIVIO AI INFRA: ENGINEERING BLUEPRINT & SOP</h2>
          <p style={{ color: '#38bdf8', margin: '8px 0 0 0', fontWeight: 'bold', letterSpacing: '1px' }}>Livio's AI Data Center | Build 1.0</p>
        </div>
        <div style={{ textAlign: 'right', color: '#64748b', fontSize: '0.9rem' }}>
          <div>ENVIRONMENT: SECURE</div>
          <div>BRIDGE: LOCALHOST:9090</div>
        </div>
      </div>

      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ color: '#eab308', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px' }}>[1.0] ARCHITECTURE PIPELINE</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '15px', backgroundColor: '#020617', padding: '20px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          <div style={{ color: '#94a3b8' }}>Base Environment Geometry:</div><div style={{ color: '#f8fafc' }}>Autodesk Revit (Static Mesh)</div>
          <div style={{ color: '#94a3b8' }}>Hardware Assets & Screens:</div><div style={{ color: '#f8fafc' }}>NVIDIA Nucleus Server (Live USD References)</div>
          <div style={{ color: '#94a3b8' }}>State Management API:</div><div style={{ color: '#f8fafc' }}>Python FastAPI (Data Routing)</div>
          <div style={{ color: '#94a3b8' }}>Physical Execution Engine:</div><div style={{ color: '#f8fafc' }}>Omniverse Python Listener (Bi-directional Sync)</div>
        </div>
      </div>

      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ color: '#eab308', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px' }}>[2.0] MATHEMATICAL KINEMATICS</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b', color: '#f8fafc' }}>
              <th style={{ padding: '15px' }}>Parameter</th>
              <th style={{ padding: '15px' }}>Execution Logic</th>
              <th style={{ padding: '15px' }}>Target Action</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '15px', color: '#38bdf8', fontWeight: 'bold' }}>PDU Power Draw</td>
              <td style={{ padding: '15px' }}>(Global Load % ÷ 100) × Total Facility Capacity</td>
              <td style={{ padding: '15px', color: '#94a3b8' }}>Dashboard Stats Render</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '15px', color: '#38bdf8', fontWeight: 'bold' }}>CDU Coolant Flow</td>
              <td style={{ padding: '15px' }}>Global Load % × 1.2 Multiplier</td>
              <td style={{ padding: '15px', color: '#94a3b8' }}>Dashboard Stats Render</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '15px', color: '#38bdf8', fontWeight: 'bold' }}>Rack Exhaust Temp</td>
              <td style={{ padding: '15px' }}>25.0°C Base + (Global Load % × 0.15)</td>
              <td style={{ padding: '15px', color: '#94a3b8' }}>Rack UI Metric</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #1e293b' }}>
              <td style={{ padding: '15px', color: '#38bdf8', fontWeight: 'bold' }}>3D Fan Actuation</td>
              <td style={{ padding: '15px' }}>1500 RPM Base + (Global Load % × 45)</td>
              <td style={{ padding: '15px', color: '#94a3b8' }}>Omniverse USD Mesh Rotation</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '35px' }}>
        <h3 style={{ color: '#eab308', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px' }}>[3.0] SAFETY THRESHOLDS & VISUAL STATES</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1, backgroundColor: '#020617', borderLeft: '4px solid #06b6d4', padding: '20px', borderRadius: '4px' }}>
            <h4 style={{ color: '#06b6d4', margin: '0 0 15px 0', fontSize: '1.1rem' }}>NOMINAL STATE (Load &lt;= 85%)</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li><b>Web UI:</b> Standard monitoring active.</li>
              <li><b>3D Material:</b> Nucleus MDL injected successfully.</li>
              <li><b>Emissive Color:</b> Cyan Gf.Vec3f(0.0, 0.8, 1.0)</li>
              <li><b>Emissive Intensity:</b> Locked at 30,000 units.</li>
            </ul>
          </div>
          <div style={{ flex: 1, backgroundColor: '#020617', borderLeft: '4px solid #ef4444', padding: '20px', borderRadius: '4px' }}>
            <h4 style={{ color: '#ef4444', margin: '0 0 15px 0', fontSize: '1.1rem' }}>CRITICAL STATE (Load &gt; 85%)</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.8' }}>
              <li><b>Web UI:</b> Red pulse warning banner triggered.</li>
              <li><b>3D Material:</b> Emissive loop switches to Danger Mode.</li>
              <li><b>Emissive Color:</b> Pure Red Gf.Vec3f(1.0, 0.0, 0.0)</li>
              <li><b>Emissive Intensity:</b> Pulsing array (2k - 50k units).</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: '#eab308', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '15px' }}>[4.0] ASSET DEPLOYMENT PROTOCOL</h3>
        <div style={{ backgroundColor: '#020617', padding: '20px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          <p style={{ margin: '0 0 15px 0', color: '#f8fafc', fontWeight: 'bold' }}>Trigger: Dashboard "+ DEPLOY NEW RACK" Event</p>
          <ol style={{ margin: 0, paddingLeft: '20px', color: '#94a3b8', lineHeight: '2' }}>
            <li>React UI sends POST request to <code style={{ color: '#38bdf8', backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>/update_state</code> with incremented rack count.</li>
            <li>Omniverse listener detects target vs current state mismatch.</li>
            <li>Python execution engine extracts raw USD URL from Nucleus reference metadata.</li>
            <li>System overrides security lock via <code style={{ color: '#38bdf8', backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>BindMaterialCommand</code>.</li>
            <li>Clone is injected and geometrically offset by <code style={{ color: '#38bdf8', backgroundColor: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>X: +150.0 units</code> to align physically.</li>
          </ol>
        </div>
      </div>

    </div>
  );

  // --- 5. MAIN RENDER ---
  return (
    <div className="dashboard-container">
      
      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '25px', marginBottom: '30px', borderBottom: '2px solid #1e293b', paddingBottom: '5px' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{ padding: '10px 15px', fontSize: '1.2rem', cursor: 'pointer', background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#38bdf8' : '#64748b', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal', borderBottom: activeTab === 'dashboard' ? '3px solid #38bdf8' : '3px solid transparent', transition: 'all 0.2s' }}>
          🎛️ COMMAND CENTER
        </button>
        <button 
          onClick={() => setActiveTab('sop')}
          style={{ padding: '10px 15px', fontSize: '1.2rem', cursor: 'pointer', background: 'none', border: 'none', color: activeTab === 'sop' ? '#38bdf8' : '#64748b', fontWeight: activeTab === 'sop' ? 'bold' : 'normal', borderBottom: activeTab === 'sop' ? '3px solid #38bdf8' : '3px solid transparent', transition: 'all 0.2s' }}>
          📄 SYSTEM SOP
        </button>
      </div>

      {/* CONDITIONAL RENDERING */}
      {activeTab === 'dashboard' ? (
        <>
          {isDanger && (
            <div className="danger-alert">
              ⚠️ CRITICAL WARNING: GLOBAL THERMAL LOAD EXCEEDS 85%. THROTTLE IMMINENT.
            </div>
          )}

          {/* Header Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#f8fafc', fontSize: '2.5rem', letterSpacing: '2px', textShadow: '0 0 15px rgba(255,255,255,0.1)' }}>LIVIO<span style={{ color: '#38bdf8' }}>//</span>Data Center Control</h1>
            <button 
              className={`master-btn ${state.playing ? 'active' : 'idle'}`}
              onClick={() => sendUpdate(state.load, !state.playing)}
            >
              {state.playing ? '⏹ DEACTIVATE ENGINE' : '▶ INITIATE ENGINE'}
            </button>
          </div>

          {/* Top Metrics Grid */}
          <div className="stats-grid">
            <div className="card border-power">
              <h3>⚡ LIVE PDU (POWER)</h3>
              <div className="value">{currentUsageKW.toFixed(1)}<span className="unit">kW</span></div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>Facility Max: {totalCapacityKW} kW</p>
            </div>
            <div className="card border-coolant">
              <h3>💧 LIVE CDU (COOLANT)</h3>
              <div className="value">{coolantFlowLS.toFixed(1)}<span className="unit">L/s</span></div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px' }}>Pump Status: {state.playing && state.load > 0 ? 'ACTIVE' : 'STANDBY'}</p>
            </div>
            <div className="card border-load">
              <h3>🎛️ GLOBAL SERVER LOAD</h3>
              <div className="value" style={{ color: isDanger ? '#ef4444' : '#f8fafc' }}>{state.load}<span className="unit">%</span></div>
              <div className="slider-container">
                <input 
                  type="range" min="0" max="100" 
                  value={state.load}
                  onChange={(e) => sendUpdate(parseInt(e.target.value), state.playing)}
                />
              </div>
            </div>
          </div>

          {/* Dynamic Rack Grid */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '40px' }}>
            <h2 style={{ color: '#cbd5e1', fontSize: '1.4rem' }}>PHYSICAL TOPOLOGY ({datacenter.rackCount} ACTIVE NODES)</h2>
            <button 
              onClick={handleAddRack}
              style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>
              + DEPLOY HARDWARE
            </button>
          </div>
          
          <div className="rack-grid">
            {[...Array(datacenter.rackCount)].map((_, index) => (
              <div key={index} className="card" style={{ borderTop: '3px solid #3b82f6', padding: '15px' }}>
                <h3 style={{ color: '#38bdf8', marginBottom: '15px', fontSize: '1.1rem' }}>Rack 0{index + 1} // 42U</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Load:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{state.playing ? state.load : 0}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>Exhaust:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{state.playing ? (25 + (state.load * 0.15)).toFixed(1) : 25.0}°C</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Fans:</span>
                  <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{state.playing ? parseInt(1500 + (state.load * 45)) : 0} RPM</span>
                </div>
              </div>
            ))}
          </div>

          {/* Console Terminal */}
          <h2 style={{ color: '#cbd5e1', fontSize: '1.4rem', marginBottom: '15px', marginTop: '40px' }}>EVENT TERMINAL</h2>
          <div style={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '20px', height: '180px', overflowY: 'auto', fontFamily: 'monospace', color: '#10b981', fontSize: '0.95rem', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)' }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #0f172a', paddingBottom: '4px' }}>{log}</div>
            ))}
            <div ref={logEndRef} />
          </div>
        </>
      ) : (
        <RenderSOP />
      )}

    </div>
  );
};

export default App;