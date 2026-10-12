javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Sensor Module */

// Normal operating ranges for the virtual simulation
const SENSOR_LIMITS = {
    minPressure: 1.5,
    maxPressure: 3.0,
    minFlowRate: 3.0
};

/**
 * Update flow and pressure sensor readings.
 * Called by simulator.js every simulation step.
 */
function updateSensors(data) {
    if (!data) return;

    updateFlowSensor(data);
    updatePressureSensor(data);
}

/**
 * Update the virtual flow sensor.
 */
function updateFlowSensor(data) {
    const flowStatus = document.getElementById("flowStatus");
    const flowMessage = document.getElementById("flowMessage");
    const flowData = document.getElementById("flowData");
    const flowHealth = document.getElementById("flowHealth");

    const isFlowing = Boolean(data.flow);
    const rate = Number(data.flowRate) || 0;
    const pressure = Number(data.pressure);
    const pressureNormal = Number.isFinite(pressure) &&
        pressure >= SENSOR_LIMITS.minPressure &&
        pressure <= SENSOR_LIMITS.maxPressure;
    const sprayConfirmed = Boolean(data.sprayingActive);

    if (flowStatus) {
        flowStatus.textContent = isFlowing ? "Flow Detected" : "No Flow";
    }

    if (flowMessage) {
        flowMessage.textContent = sprayConfirmed
            ? `Spraying confirmed · ${rate.toFixed(2)} L/min`
            : !isFlowing
                ? "No liquid flow detected"
                : !pressureNormal
                    ? "Flow present, but pressure is outside the safe range"
                    : "Spraying inactive";
    }

    if (flowData) {
        flowData.textContent = `${rate.toFixed(2)} L/min`;
    }

    if (flowHealth) {
        flowHealth.textContent = isFlowing ? "Normal" : "No Flow";
        flowHealth.style.color = isFlowing ? "#15803d" : "#dc2626";
    }
}

/**
 * Update the virtual pressure sensor.
 */
function updatePressureSensor(data) {
    const pressureElement = document.getElementById("pressure");
    const pressureData = document.getElementById("pressureData");
    const pressureHealth = document.getElementById("pressureHealth");

    const pressure = Number(data.pressure) || 0;

    if (pressureElement) {
        pressureElement.textContent = `${pressure.toFixed(2)} bar`;
    }

    if (pressureData) {
        pressureData.textContent = `${pressure.toFixed(2)} bar`;
    }

    let status = "Normal";
    let color = "#15803d";

    if (pressure < SENSOR_LIMITS.minPressure) {
        status = "Low Pressure";
        color = "#dc2626";
    } else if (pressure > SENSOR_LIMITS.maxPressure) {
        status = "High Pressure";
        color = "#dc2626";
    }

    if (pressureHealth) {
        pressureHealth.textContent = status;
        pressureHealth.style.color = color;
    }
}

/**
 * Restore sensor displays to their initial state.
 */
function resetSensors() {
    const elements = {
        flowStatus: "Waiting",
        flowMessage: "Start simulation to receive data.",
        flowData: "-- L/min",
        flowHealth: "Standby",
        pressure: "-- bar",
        pressureData: "-- bar",
        pressureHealth: "Standby"
    };

    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;

            if (id === "flowHealth" || id === "pressureHealth") {
                element.style.color = "";
            }
        }
    });
}

console.log("Virtual sensor module initialized.");
