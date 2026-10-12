
/* ==========================================
   SMART TEA GARDEN SPRAYING SYSTEM
   Main Application Controller
========================================== */

// Application state
const appState = {
    running: false,
    timer: null,
    elapsedTime: 0
};

// HTML elements
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const systemStatus = document.getElementById("systemStatus");
const workerPosition = document.getElementById("workerPosition");
const alertBox = document.getElementById("alertBox");

// Update system status
function setSystemStatus(message, online = false) {
    if (systemStatus) {
        systemStatus.textContent = message;

        systemStatus.style.color = online
            ? "#baf5ce"
            : "#ffffff";
    }
}

// Display an alert
function showAppAlert(message, type = "info") {
    if (!alertBox) return;

    alertBox.textContent = message;
    alertBox.className = "alert-box";

    if (type === "warning") {
        alertBox.classList.add("warning");
    }

    if (type === "error") {
        alertBox.classList.add("error");
    }
}

// Start simulation
function startApp() {
    if (appState.running) return;

    appState.running = true;

    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;

    setSystemStatus("SIMULATION RUNNING", true);

    if (workerPosition) {
        workerPosition.textContent = "Worker: Moving";
    }

    showAppAlert("Simulation started. Generating virtual sensor data.");

    // Call simulator module if available
    if (typeof startSimulation === "function") {
        startSimulation();
    } else {
        console.warn(
            "Simulator module is not ready yet. Create simulator.js next."
        );
    }
}

// Stop simulation
function stopApp() {
    appState.running = false;

    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;

    setSystemStatus("SIMULATION PAUSED", true);

    if (workerPosition) {
        workerPosition.textContent = "Worker: Paused";
    }

    if (typeof stopSimulation === "function") {
        stopSimulation();
    }

    showAppAlert("Simulation stopped.");
}

// Reset simulation
function resetApp() {
    stopApp();

    appState.elapsedTime = 0;

    if (typeof resetSimulation === "function") {
        resetSimulation();
    }

    if (workerPosition) {
        workerPosition.textContent = "Worker: Idle";
    }

    setSystemStatus("SYSTEM READY", false);

    showAppAlert("Simulation reset. Ready to start.");
}

function onSimulationComplete() {
    appState.running = false;

    if (startBtn) startBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = true;

    setSystemStatus("SIMULATION COMPLETED");
    if (workerPosition) {
        workerPosition.textContent = "Worker: Finished";
    }
}
// Button events
if (startBtn) {
    startBtn.addEventListener("click", startApp);
}

if (stopBtn) {
    stopBtn.addEventListener("click", stopApp);
}

if (resetBtn) {
    resetBtn.addEventListener("click", resetApp);
}

// Initial state
if (stopBtn) stopBtn.disabled = true;

setSystemStatus("SYSTEM READY", false);

showAppAlert("System ready. Start the simulation.");

console.log("Smart Tea Garden application initialized.");
