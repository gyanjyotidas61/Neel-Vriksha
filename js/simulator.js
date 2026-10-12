javascript
/* =====================================================
   SMART TEA GARDEN SPRAYING SYSTEM
   Virtual Simulation Controller
   No physical vehicle or hardware required
   ===================================================== */

// Simulation configuration
const SIMULATION_INTERVAL = 1000;

const garden = {
    rows: 8,
    cols: 12
};

// Virtual sensor data
const sensorData = {
    latitude: 26.1445,
    longitude: 91.7362,
    flow: false,
    flowRate: 0,
    pressure: 0,
    timestamp: null
};

// Simulation variables
let simulationTimer = null;
let simulationStep = 0;
let simulationRunning = false;
let workerPath = [];

// Create a zigzag path through the virtual garden
function createWorkerPath() {
    workerPath = [];

    for (let row = 0; row < garden.rows; row++) {
        if (row % 2 === 0) {
            for (let col = 0; col < garden.cols; col++) {
                workerPath.push({ row, col });
            }
        } else {
            for (let col = garden.cols - 1; col >= 0; col--) {
                workerPath.push({ row, col });
            }
        }
    }
}

async function loadFieldConfig() {
    try {
        const response = await fetch("./field.json");

        if (!response.ok) {
            throw new Error("Could not load field.json");
        }

        const config = await response.json();

        garden.rows = config.field.rows;
        garden.cols = config.field.columns;

        console.log("Field configuration loaded:", config);
        return config;
    } catch (error) {
        console.error("Field configuration error:", error);
        return null;
    }
}

// Generate virtual GPS, flow and pressure readings
function generateSensorData() {
    const position = workerPath[simulationStep];

    if (!position) return null;

    // Simulated GPS coordinates
    sensorData.latitude =
        26.1445 + position.row * 0.00005;

    sensorData.longitude =
        91.7362 + position.col * 0.00005;

    // Simulate temporary flow failures
    sensorData.flow = !(
        (simulationStep >= 18 && simulationStep <= 21) ||
        (simulationStep >= 58 && simulationStep <= 60)
    );

    // Simulate low and high pressure events
    if (simulationStep >= 35 && simulationStep <= 37) {
        sensorData.pressure = 1.1;
    } else if (
        simulationStep >= 75 &&
        simulationStep <= 77
    ) {
        sensorData.pressure = 3.5;
    } else {
        sensorData.pressure =
            2.0 + Math.sin(simulationStep * 0.2) * 0.15;
    }

    // Simulate liquid flow rate
    sensorData.flowRate = sensorData.flow
        ? 4.0 + Math.random() * 0.5
        : 0;

    sensorData.timestamp = new Date().toISOString();

    return {
        ...sensorData,
        step: simulationStep,
        row: position.row,
        col: position.col,
        running: simulationRunning
    };
}

// Process one simulation step
function processSimulationStep() {
    if (!simulationRunning) return;

    const data = generateSensorData();

    // Stop when the worker has reached the end of the garden
    if (!data) {
        stopSimulation();

        if (typeof showAppAlert === "function") {
            showAppAlert(
                "Garden traversal completed. Reset to run again."
            );
        }

        // Notify the main application controller
        if (typeof onSimulationComplete === "function") {
            onSimulationComplete();
        }

        return;
    }

    // 1. Update virtual GPS
    if (typeof updateGPS === "function") {
        updateGPS(data);
    }

    // 2. Update flow and pressure sensors
    if (typeof updateSensors === "function") {
        updateSensors(data);
    }

    // 3. Update virtual spraying system
    if (typeof updateSpraying === "function") {
        updateSpraying(data);
    }

    // 4. Update garden coverage
    if (typeof updateCoverage === "function") {
        updateCoverage(data);
    }

    // 5. Update dashboard readings
    if (typeof updateDashboard === "function") {
        updateDashboard(data);
    }

    // 6. Check alerts
    if (typeof checkAlerts === "function") {
        checkAlerts(data);
    }

    console.log("Virtual sensor data:", data);

    simulationStep++;
}

// Start the simulation
function startSimulation() {
    if (simulationRunning) return;

    // Allow a fresh run after completing the garden path
    if (simulationStep >= workerPath.length) {
        simulationStep = 0;

        if (typeof resetCoverage === "function") {
            resetCoverage();
        }

        if (typeof resetSpraying === "function") {
            resetSpraying();
        }
    }

    simulationRunning = true;

    // Process the first step immediately
    processSimulationStep();

    // Continue moving through the garden every second
    simulationTimer = setInterval(
        processSimulationStep,
        SIMULATION_INTERVAL
    );
}

// Stop the simulation
function stopSimulation() {
    simulationRunning = false;

    if (simulationTimer !== null) {
        clearInterval(simulationTimer);
        simulationTimer = null;
    }
}

// Reset the entire simulation
function resetSimulation() {
    stopSimulation();

    simulationStep = 0;

    sensorData.latitude = 26.1445;
    sensorData.longitude = 91.7362;
    sensorData.flow = false;
    sensorData.flowRate = 0;
    sensorData.pressure = 0;
    sensorData.timestamp = null;

    if (typeof resetGPS === "function") {
        resetGPS();
    }

    if (typeof resetSensors === "function") {
        resetSensors();
    }

    if (typeof resetSpraying === "function") {
        resetSpraying();
    }

    if (typeof resetCoverage === "function") {
        resetCoverage();
    }

    if (typeof resetDashboard === "function") {
        resetDashboard();
    }

    if (typeof resetAlerts === "function") {
        resetAlerts();
    }
}

// Initialize the garden path
createWorkerPath();

console.log(
    `Simulator initialized: ${garden.rows} rows, ` +
    `${garden.cols} columns, ` +
    `${workerPath.length} garden cells.`
);
