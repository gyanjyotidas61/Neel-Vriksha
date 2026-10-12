# Smart Tea Garden Spraying System — Simulation

## Run locally
1. Keep the folder structure as-is.
2. Open a terminal in this folder.
3. Run `python -m backend` to start the dashboard and backend API.
4. Open `http://localhost:8000` in your browser.

Do not open `index.html` directly with `file://`, because the simulator may fetch `field.json` and browsers can block local fetches.

## What this demo does
- Simulates a worker following a zigzag path across an 8 x 12 grid.
- Simulates GPS, flow and pressure readings, including test faults.
- Confirms spraying only when flow is present and pressure is between 1.5 and 3.0 bar.
- Updates coverage, missed/overlap zones, alerts, and virtual liquid usage.

## Important assumptions
- All sensor readings are simulated; hardware is not connected.
- The 1 m² per grid cell is an illustrative value only. Calibrate it to real garden geometry before reporting actual area.
- Pressure thresholds and flow thresholds are demo values; validate them against the actual sprayer and sensor specifications.
- A grid cell is only a simplified representation of spray coverage; it does not prove leaf-level deposition.

## Project files
- `index.html`: dashboard structure
- `css/style.css`, `css/dashboard.css`: styles
- `js/simulator.js`: simulation path and sensor data
- `js/coverage.js`: grid and coverage statistics
- `js/spraying.js`: spray confirmation and virtual tank
- `js/gps.js`, `js/sensors.js`: sensor displays
- `js/dashboard.js`: live data table and status
- `js/alerts.js`: alerts
- `js/app.js`: Start/Stop/Reset controls
- `field.json`: simulation configuration
- `backend/`: Python standard-library web server and read-only JSON API

## Backend API
- `GET /api/health`: server health
- `GET /api/field`: validated simulation configuration from `field.json`
- `GET /api/config`: alias for `/api/field`

See `backend/README.md` for backend details. The simulation remains browser-side;
the backend currently serves the dashboard and configuration only.
