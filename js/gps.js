javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Virtual GPS Module */

const DEFAULT_LATITUDE = 26.1445;
const DEFAULT_LONGITUDE = 91.7362;

/**
 * Update the GPS information using virtual sensor data.
 * Called by simulator.js during each simulation step.
 */
function updateGPS(data) {
    if (!data) return;

    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");
    const gpsDataElement = document.getElementById("gpsData");
    const workerPositionElement = document.getElementById("workerPosition");

    // Update latitude and longitude cards
    if (latitudeElement) {
        latitudeElement.textContent = Number(data.latitude).toFixed(6);
    }

    if (longitudeElement) {
        longitudeElement.textContent = Number(data.longitude).toFixed(6);
    }

    // Update the live GPS data table
    if (gpsDataElement) {
        gpsDataElement.textContent =
            `${Number(data.latitude).toFixed(6)}, ` +
            `${Number(data.longitude).toFixed(6)}`;
    }

    // Display the worker's current garden-grid position
    if (workerPositionElement) {
        workerPositionElement.textContent =
            `Worker: Row ${data.row + 1}, Column ${data.col + 1}`;
    }
}

/**
 * Reset GPS display to the starting virtual coordinates.
 */
function resetGPS() {
    const latitudeElement = document.getElementById("latitude");
    const longitudeElement = document.getElementById("longitude");
    const gpsDataElement = document.getElementById("gpsData");
    const workerPositionElement = document.getElementById("workerPosition");

    if (latitudeElement) {
        latitudeElement.textContent = DEFAULT_LATITUDE.toFixed(6);
    }

    if (longitudeElement) {
        longitudeElement.textContent = DEFAULT_LONGITUDE.toFixed(6);
    }

    if (gpsDataElement) {
        gpsDataElement.textContent =
            `${DEFAULT_LATITUDE.toFixed(6)}, ` +
            `${DEFAULT_LONGITUDE.toFixed(6)}`;
    }

    if (workerPositionElement) {
        workerPositionElement.textContent = "Worker: Idle";
    }
}

console.log("Virtual GPS module initialized.");

