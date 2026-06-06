# 🌧️ METEOR-X // Atmospheric Prediction Terminal Guide

This guide details the step-by-step setup and code implementation for building the futuristic rain prediction system. Follow the steps below to implement the codebase in the structure already created for you.

---

## 📂 Created Project Structure

```
rain-prediction/
├── backend/
│   ├── package.json      <-- Configured with Express, Cors, Axios, Dotenv
│   ├── server.js          <-- Prepared with API endpoints and prediction logic
│   └── .env              <-- Environment variables (Add your API key here)
├── frontend/
│   ├── package.json      <-- Vite + React configuration
│   ├── vite.config.js    <-- Vite proxy setup to avoid CORS issues
│   ├── index.html        <-- Main index file including futuristic Google Fonts
│   └── src/
│       ├── main.jsx      <-- React entry point
│       ├── App.jsx        <-- Main container component
│       ├── index.css      <-- Stylesheet variables & base settings
│       └── components/
│           └── .gitkeep   <-- Folder for your modular HUD elements
└── GUIDE.md              <-- This file
```

---

## 🛠️ Step-by-Step Implementation Guide

### Step 1: OpenWeatherMap API Setup
1. Visit [openweathermap.org](https://openweathermap.org/) and sign up for a free account.
2. Navigate to your API keys page and copy your generated key.
3. Open `backend/.env` and replace `YOUR_API_KEY_HERE` with your key:
   ```env
   PORT=5000
   OPENWEATHER_API_KEY=abcdef1234567890yourkeyhere
   ```
   *Note: If no API key is specified, the server will automatically serve simulated weather forecasts for London, Seattle, Tokyo, Sydney, and the Sahara Desert so you can test immediately!*

---

### Step 2: Implement the Frontend Styling (`frontend/src/index.css`)
Open `frontend/src/index.css` and add the following CSS rules to create the sci-fi HUD cyberpunk interface.

```css
/* Futuristic Sci-Fi CSS Variables and Base Styles */
:root {
  --bg-color: #050a18;
  --bg-card: rgba(11, 22, 47, 0.65);
  --text-primary: #e2e8f0;
  --text-secondary: #00f0ff;
  --text-muted: #64748b;
  --cyan-glow: #00f0ff;
  --purple-glow: #bd00ff;
  --neon-green: #39ff14;
  --neon-orange: #ff5e00;
  --neon-red: #ff0055;
  --border-color: rgba(0, 240, 255, 0.15);
  --border-hover: rgba(0, 240, 255, 0.4);
  --font-mono: 'Share Tech Mono', monospace;
}

body {
  margin: 0;
  background-color: var(--bg-color);
  background-image: 
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  background-size: 100% 4px, 6px 100%;
  color: var(--text-primary);
  font-family: 'Inter', system-ui, sans-serif;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Grid Matrix Background overlay */
.matrix-grid {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center;
  z-index: -1;
  pointer-events: none;
}

/* Futuristic Scanline Effect */
.scanline {
  width: 100%;
  height: 4px;
  background: rgba(0, 240, 255, 0.1);
  position: fixed;
  animation: scan 6s linear infinite;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

@keyframes scan {
  0% { top: -10px; }
  100% { top: 100%; }
}

/* Sci-fi Card Container styling */
.hud-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.05), inset 0 0 15px rgba(0, 240, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.hud-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyan-glow), transparent);
  animation: border-flow 4s infinite linear;
}

@keyframes border-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.hud-panel:hover {
  border-color: var(--border-hover);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.15), inset 0 0 20px rgba(0, 240, 255, 0.08);
}

/* Neon Text styles */
.neon-text-cyan {
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  color: var(--cyan-glow);
}

.neon-text-purple {
  text-shadow: 0 0 10px rgba(189, 0, 255, 0.6);
  color: var(--purple-glow);
}

/* Custom inputs */
.hud-input {
  background: rgba(3, 7, 18, 0.8);
  border: 1px solid var(--cyan-glow);
  color: #fff;
  font-family: var(--font-mono);
  padding: 10px 15px;
  font-size: 1rem;
  letter-spacing: 1px;
  border-radius: 4px;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.1);
  transition: all 0.2s ease;
}

.hud-input:focus {
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  background: rgba(3, 7, 18, 0.95);
}

.hud-button {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(189, 0, 255, 0.2) 100%);
  border: 1px solid var(--cyan-glow);
  color: #fff;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.hud-button:hover {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.4) 0%, rgba(189, 0, 255, 0.4) 100%);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
  transform: translateY(-1px);
}
```

---

### Step 3: Implement components in React (`frontend/src/App.jsx`)
Replace the contents of `frontend/src/App.jsx` with this futuristic monitoring terminal application that connects to the backend API:

```jsx
import React, { useState, useEffect } from 'react';

export default function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);

  // Live timestamp for the HUD header
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    
    // Boot up terminal log sequence
    addLog("Initializing Core Meteorological Engine...");
    setTimeout(() => addLog("Awaiting atmospheric input data..."), 800);

    return () => clearInterval(timer);
  }, []);

  const addLog = (message) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 5)]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError(null);
    addLog(`Initiating scan for location: "${city.toUpperCase()}"`);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch weather telemetry');
      }

      setData(result);
      addLog(`Scan complete. Rain Probability calculated: ${result.prediction.probability}%`);
      addLog(`Status: ${result.prediction.classification.toUpperCase()}`);
    } catch (err) {
      setError(err.message);
      addLog(`SCAN ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="matrix-grid"></div>
      <div className="scanline"></div>

      {/* --- HUD HEADER MODULE --- */}
      <header className="hud-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px' }}>
        <div>
          <h1 className="neon-text-cyan" style={{ margin: 0, fontFamily: 'Orbitron', fontSize: '1.8rem', letterSpacing: '2px' }}>
            METEOR-X <span style={{ fontSize: '0.8rem', verticalAlign: 'middle', color: 'rgba(255,255,255,0.4)' }}>// ATMOSPHERIC TELEMETRY</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '20px', fontFamily: 'Share Tech Mono', fontSize: '1rem' }}>
          <div>COORDS: <span style={{ color: 'var(--cyan-glow)' }}>47.6062° N, 122.3321° W</span></div>
          <div>SYSTEM TIME: <span style={{ color: 'var(--cyan-glow)' }}>{time}</span></div>
          <div>STATUS: <span style={{ color: 'var(--neon-green)' }}>ONLINE</span></div>
        </div>
      </header>

      {/* --- SEARCH / CONSOLE MODULE --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Search Panel */}
        <section className="hud-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', margin: '0 0 10px 0', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '8px' }}>
            [01] TARGET LOCATION QUERY
          </h2>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              className="hud-input"
              style={{ flexGrow: 1 }}
              placeholder="ENTER CITY NAME..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button type="submit" className="hud-button" disabled={loading}>
              {loading ? 'Scanning...' : 'SCAN AREA'}
            </button>
          </form>
          {error && (
            <div style={{ color: 'var(--neon-red)', border: '1px solid var(--neon-red)', padding: '10px', background: 'rgba(255,0,85,0.1)', fontFamily: 'Share Tech Mono' }}>
              &gt;&gt; ERROR: {error}
            </div>
          )}
        </section>

        {/* Live Systems Terminal Logs */}
        <section className="hud-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', margin: '0 0 10px 0', borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '8px' }}>
            [02] LOG CONSOLE TELEMETRY
          </h2>
          <div style={{ fontFamily: 'Share Tech Mono', color: '#64748b', fontSize: '0.9rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {logs.map((log, idx) => (
              <div key={idx} style={{ color: idx === 0 ? 'var(--cyan-glow)' : 'inherit' }}>
                &gt; {log}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* --- WEATHER PREDICTION HUD DETAILS --- */}
      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          
          {/* Circular Prediction Gauge */}
          <section className="hud-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '15px' }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', margin: 0 }}>RAIN RISK COEFFICIENT</h3>
            
            <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Circular Gauge Border Glow */}
              <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="75" cy="75" r="65" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="75" cy="75" r="65" 
                  stroke={data.prediction.color} 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="408"
                  strokeDashoffset={408 - (408 * data.prediction.probability) / 100}
                  style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
              </svg>
              <div style={{ position: 'absolute', fontFamily: 'Orbitron', fontSize: '2.2rem', fontWeight: 'bold', textShadow: `0 0 10px ${data.prediction.color}` }}>
                {data.prediction.probability}%
              </div>
            </div>

            <div style={{ color: data.prediction.color, fontWeight: 'bold', fontFamily: 'Orbitron', fontSize: '1.2rem', letterSpacing: '1px' }}>
              {data.prediction.classification.toUpperCase()}
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {data.prediction.description}
            </p>
          </section>

          {/* Sensor Diagnostics Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Raw Sensors Reading Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
              <div className="hud-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>TEMPERATURE</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '5px 0', fontFamily: 'Orbitron' }}>{data.weatherData.temp}°C</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-glow)' }}>FEELS LIKE: {data.weatherData.feelsLike}°C</div>
              </div>
              <div className="hud-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>HUMIDITY</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '5px 0', fontFamily: 'Orbitron' }}>{data.weatherData.humidity}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-glow)' }}>CONDENSATION CAP</div>
              </div>
              <div className="hud-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>PRESSURE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '5px 0', fontFamily: 'Orbitron' }}>{data.weatherData.pressure} hPa</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-glow)' }}>BAROMETRIC LVL</div>
              </div>
              <div className="hud-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'Share Tech Mono' }}>WIND SPEED</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', margin: '5px 0', fontFamily: 'Orbitron' }}>{data.weatherData.windSpeed} m/s</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--cyan-glow)' }}>CLOUDS: {data.weatherData.clouds}%</div>
              </div>
            </div>

            {/* Heuristic Diagnostic Breakdown */}
            <section className="hud-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', margin: 0, borderBottom: '1px solid rgba(0,240,255,0.1)', paddingBottom: '8px' }}>
                METEOROLOGICAL SENSOR CONTRIBUTION BREAKDOWN
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(data.prediction.metrics).map(([key, metric]) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Share Tech Mono', fontSize: '0.9rem', marginBottom: '4px' }}>
                      <span>{metric.label} (Value: {metric.value}{key === 'humidity' || key === 'cloudiness' ? '%' : key === 'barometricPressure' ? ' hPa' : '°C'})</span>
                      <span style={{ color: 'var(--cyan-glow)' }}>+ {metric.score} / {metric.max} pts</span>
                    </div>
                    {/* Futuristic progress bar */}
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${(metric.score / metric.max) * 100}%`, 
                          background: `linear-gradient(90deg, var(--cyan-glow), ${data.prediction.color})`,
                          transition: 'width 1s ease-out' 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 How to Run the Application

You can spin up both components easily. In your terminal:

### 1. Run the Express Backend
Navigate to the backend directory and run setup commands:
```powershell
cd backend
npm install
npm run dev
```
The server will start listening at `http://localhost:5000`.

### 2. Run the React Frontend
Open another terminal, navigate to the frontend directory, and run:
```powershell
cd frontend
npm install
npm run dev
```
The Vite development server will spin up on `http://localhost:5173`. Open this URL in your browser to run the weather analysis command center.
