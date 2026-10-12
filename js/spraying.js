javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Spraying Module */

const SPRAYING_CONFIG = {
    flowRate: 4.0,          // Approximate flow in L/min
    sprayDuration: 1,       // Simulation step duration in seconds
    maxTankCapacity: 100    // Virtual tank capacity in litres
};

const sprayingState = {
    active: false,
    totalSprayingSeconds: 0,
    liquidUsed: 0,
    tankLevel: SPRAYING_CONFIG.maxTankCapacity
};

/**
 * Update virtual spraying based on sensor readings.
 * Called once per simulation step.
 */
function updateSpraying(data) {
    if (!data) return;

    const flowRate = Number(data.flowRate) || 0;
    const pressure = Number(data.pressure);
    const flowDetected = Boolean(data.flow);

    const pressureNormal =
        Number.isFinite(pressure) &&
        pressure >= 1.5 &&
        pressure <= 3.0;

    sprayingState.active =
        flowDetected &&
        flowRate > 0 &&
        pressureNormal &&
        sprayingState.tankLevel > 0;

    data.sprayingActive = sprayingState.active;

    if (sprayingState.active) {
        sprayingState.totalSprayingSeconds +=
            SPRAYING_CONFIG.sprayDuration;

        // Convert L/min to litres used per simulation second.
        const requestedUse =
            flowRate * SPRAYING_CONFIG.sprayDuration / 60;

        const actualUse = Math.min(
            requestedUse,
            sprayingState.tankLevel
        );

        sprayingState.liquidUsed += actualUse;
        sprayingState.tankLevel -= actualUse;
    }

    renderSprayingStatus();
}

/**
 * Update spraying indicators on the dashboard.
 */
function renderSprayingStatus() {
    const sprayingStatus =
        document.getElementById("sprayingStatus");

    const sprayingData =
        document.getElementById("sprayingData");

    const sprayingHealth =
        document.getElementById("sprayingHealth");

    if (sprayingStatus) {
        if (sprayingState.active) {
            sprayingStatus.textContent = "Spraying Active";
            sprayingStatus.className = "spraying-status active";
        } else {
            sprayingStatus.textContent = "Spraying Inactive";
            sprayingStatus.className = "spraying-status inactive";
        }
    }

    if (sprayingData) {
        sprayingData.textContent = sprayingState.active
            ? "Spraying"
            : "Not Spraying";
    }

    if (sprayingHealth) {
        sprayingHealth.textContent = sprayingState.active
            ? "Active"
            : sprayingState.tankLevel <= 0
                ? "Tank Empty"
                : "Standby";
    }

    updateSprayingMetrics();
}

/**
 * Display virtual liquid usage and tank level.
 * Optional HTML elements can be added with these IDs.
 */
function updateSprayingMetrics() {
    const usedElement = document.getElementById("liquidUsed");
    const tankElement = document.getElementById("tankLevel");
    const timeElement = document.getElementById("sprayingTime");

    if (usedElement) {
        usedElement.textContent =
            `${sprayingState.liquidUsed.toFixed(2)} L`;
    }

    if (tankElement) {
        tankElement.textContent =
            `${sprayingState.tankLevel.toFixed(2)} L`;
    }

    if (timeElement) {
        timeElement.textContent =
            `${sprayingState.totalSprayingSeconds} seconds`;
    }
}

/**
 * Stop virtual spraying immediately.
 */
function stopSpraying() {
    sprayingState.active = false;
    renderSprayingStatus();
}

/**
 * Reset spraying statistics and restore the virtual tank.
 */
function resetSpraying() {
    sprayingState.active = false;
    sprayingState.totalSprayingSeconds = 0;
    sprayingState.liquidUsed = 0;
    sprayingState.tankLevel =
        SPRAYING_CONFIG.maxTankCapacity;

    renderSprayingStatus();
}

console.log("Virtual spraying module initialized.");
