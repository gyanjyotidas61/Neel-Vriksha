javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Dashboard Module */

/**
 * Update the dashboard using the latest virtual sensor data.
 * Called by simulator.js every simulation step.
 */
function updateDashboard(data) {
    if (!data) return;

    updateLiveDataTable(data);
    updateSystemOverview(data);
}

/**
 * Update the live sensor table.
 */
function updateLiveDataTable(data) {
    const gpsData = document.getElementById("gpsData");
    const flowData = document.getElementById("flowData");
    const flowHealth = document.getElementById("flowHealth");
    const pressureData = document.getElementById("pressureData");
    const pressureHealth = document.getElementById("pressureHealth");
    const sprayingData = document.getElementById("sprayingData");
    const sprayingHealth = document.getElementById("sprayingHealth");

    const flowRate = Number(data.flowRate) || 0;
    const pressure = Number(data.pressure);

    if (gpsData) {
        gpsData.textContent =
            `${Number(data.latitude).toFixed(6)}, ` +
            `${Number(data.longitude).toFixed(6)}`;
    }

    if (flowData) {
        flowData.textContent = `${flowRate.toFixed(2)} L/min`;
    }

    if (flowHealth) {
        flowHealth.textContent = data.flow ? "Normal" : "No Flow";
        setStatusColor(flowHealth, data.flow ? "normal" : "error");
    }

    if (pressureData) {
        pressureData.textContent = Number.isFinite(pressure)
            ? `${pressure.toFixed(2)} bar`
            : "-- bar";
    }

    if (pressureHealth) {
        if (!Number.isFinite(pressure)) {
            pressureHealth.textContent = "Unavailable";
            setStatusColor(pressureHealth, "warning");
        } else if (pressure < 1.5) {
            pressureHealth.textContent = "Low Pressure";
            setStatusColor(pressureHealth, "error");
        } else if (pressure > 3.0) {
            pressureHealth.textContent = "High Pressure";
            setStatusColor(pressureHealth, "error");
        } else {
            pressureHealth.textContent = "Normal";
            setStatusColor(pressureHealth, "normal");
        }
    }

    if (sprayingData) {
        sprayingData.textContent = data.flow
            ? "Spraying"
            : "Not Spraying";
    }

    if (sprayingHealth) {
        sprayingHealth.textContent = data.flow
            ? "Active"
            : "Check Flow";

        setStatusColor(sprayingHealth, data.flow ? "normal" : "error");
    }
}

/**
 * Update the main system status display.
 */
function updateSystemOverview(data) {
    const sprayingStatus = document.getElementById("sprayingStatus");

    if (sprayingStatus) {
        if (!data.flow) {
            sprayingStatus.textContent = "Flow Interrupted";
            sprayingStatus.className = "spraying-status warning";
        } else {
            sprayingStatus.textContent = "Spraying Active";
            sprayingStatus.className = "spraying-status active";
        }
    }
}

/**
 * Apply consistent status colors.
 */
function setStatusColor(element, status) {
    if (!element) return;

    const colors = {
        normal: "#15803d",
        warning: "#b45309",
        error: "#dc2626"
    };

    element.style.color = colors[status] || "";
}

/**
 * Reset dashboard fields to their initial values.
 */
function resetDashboard() {
    const defaultValues = {
        gpsData: "Waiting for GPS",
        flowData: "-- L/min",
        flowHealth: "Standby",
        pressureData: "-- bar",
        pressureHealth: "Standby",
        sprayingData: "Inactive",
        sprayingHealth: "Standby"
    };

    Object.entries(defaultValues).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
            element.style.color = "";
        }
    });

    const sprayingStatus = document.getElementById("sprayingStatus");

    if (sprayingStatus) {
        sprayingStatus.textContent = "Spraying Inactive";
        sprayingStatus.className = "spraying-status inactive";
    }
}

console.log("Dashboard module initialized.");
