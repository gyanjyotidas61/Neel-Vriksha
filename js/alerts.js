javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Alerts Module */

const ALERT_PRESSURE_MIN = 1.5; // bar
const ALERT_PRESSURE_MAX = 3.0; // bar

let lastAlertMessage = "";
let lastAlertTime = 0;

/**
 * Check virtual sensor readings and show alerts.
 * Called by simulator.js at every simulation step.
 */
function checkAlerts(data) {
    if (!data) return;

    const pressure = Number(data.pressure);
    const flowRate = Number(data.flowRate) || 0;

    // Pressure faults take priority because flow can be present while spraying is unsafe.
    // Check for low pressure.
    if (Number.isFinite(pressure) &&
        pressure < ALERT_PRESSURE_MIN) {
        showSensorAlert(
            `Low pressure warning: ${pressure.toFixed(2)} bar. Check the pump or liquid supply.`,
            "warning"
        );
        return;
    }

    // Check for high pressure.
    if (Number.isFinite(pressure) &&
        pressure > ALERT_PRESSURE_MAX) {
        showSensorAlert(
            `High pressure warning: ${pressure.toFixed(2)} bar. Check the pressure control system.`,
            "error"
        );
        return;
    }

    // Flow faults are evaluated after pressure so the most useful alert is shown.
    if (!data.flow || flowRate <= 0) {
        showSensorAlert(
            "Flow warning: No spraying liquid detected. Check the pump or nozzle.",
            "error"
        );
        return;
    }

    // All monitored readings are within the configured range.
    showSensorAlert("All monitored sensors are operating normally.", "success");
}

/**
 * Display an alert without repeating the same message every second.
 */
function showSensorAlert(message, type = "info") {
    const alertBox = document.getElementById("alertBox");
    if (!alertBox) return;

    const now = Date.now();

    // Avoid unnecessary DOM updates for repeated messages.
    if (message === lastAlertMessage && now - lastAlertTime < 5000) {
        return;
    }

    lastAlertMessage = message;
    lastAlertTime = now;

    // Use the application's existing alert function if available.
    if (typeof showAppAlert === "function") {
        showAppAlert(
            message,
            type === "error" ? "error" :
            type === "warning" ? "warning" : "info"
        );
    } else {
        alertBox.textContent = message;
        alertBox.className = "alert-box";

        if (type === "warning") {
            alertBox.classList.add("warning");
        } else if (type === "error") {
            alertBox.classList.add("error");
        }

        alertBox.setAttribute("role", "status");
    }
}

/**
 * Clear alert history when the simulation is reset.
 */
function resetAlerts() {
    lastAlertMessage = "";
    lastAlertTime = 0;

    const alertBox = document.getElementById("alertBox");

    if (alertBox) {
        alertBox.textContent = "System ready. Start the simulation.";
        alertBox.className = "alert-box";
    }
}

console.log("Virtual alerts module initialized.");
