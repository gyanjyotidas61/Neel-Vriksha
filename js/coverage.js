javascript
/* SMART TEA GARDEN SPRAYING SYSTEM - Coverage Module */

const COVERAGE_ROWS = 8;
const COVERAGE_COLS = 12;
const TOTAL_GARDEN_CELLS = COVERAGE_ROWS * COVERAGE_COLS;
const CELL_AREA_M2 = 1; // illustrative simulation value, not field-calibrated

// Stores the spraying history of each garden cell.
let gardenCoverage = [];
let currentWorkerCell = null;

function initializeCoverage() {
    gardenCoverage = Array.from(
        { length: COVERAGE_ROWS },
        () => Array.from(
            { length: COVERAGE_COLS },
            () => ({
                state: "not-sprayed",
                visits: 0
            })
        )
    );

    currentWorkerCell = null;
    renderGardenGrid();
    updateCoverageStatistics();
}

/**
 * Create the virtual garden grid.
 */
function renderGardenGrid() {
    const grid = document.getElementById("gardenGrid");
    if (!grid) return;

    grid.innerHTML = "";
    grid.style.display = "grid";
    grid.style.gridTemplateColumns =
        `repeat(${COVERAGE_COLS}, minmax(0, 1fr))`;

    for (let row = 0; row < COVERAGE_ROWS; row++) {
        for (let col = 0; col < COVERAGE_COLS; col++) {
            const cell = document.createElement("div");

            cell.className = "garden-cell not-sprayed";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.title = `Row ${row + 1}, Column ${col + 1}: Not sprayed`;
            cell.setAttribute("aria-label", cell.title);

            grid.appendChild(cell);
        }
    }
}

/**
 * Update garden coverage for each simulation step.
 */
function updateCoverage(data) {
    if (!data) return;

    const row = Number(data.row);
    const col = Number(data.col);

    if (
        !Number.isInteger(row) ||
        !Number.isInteger(col) ||
        row < 0 || row >= COVERAGE_ROWS ||
        col < 0 || col >= COVERAGE_COLS
    ) {
        return;
    }

    const cellData = gardenCoverage[row][col];

    // Remove the worker marker from the previous cell.
    if (currentWorkerCell) {
        const previousCell = getGardenCell(
            currentWorkerCell.row,
            currentWorkerCell.col
        );

        if (previousCell) {
            previousCell.classList.remove("worker");
            previousCell.classList.add(
                gardenCoverage[currentWorkerCell.row]
                    [currentWorkerCell.col].state
            );
        }
    }

    // Count a spray only when both flow and pressure are in range.
    // updateSpraying() sets sprayingActive before this module is called.
    const sprayConfirmed = Boolean(data.sprayingActive);

    if (sprayConfirmed) {
        if (cellData.state === "sprayed" || cellData.state === "overlap") {
            cellData.state = "overlap";
        } else {
            cellData.state = "sprayed";
        }
    } else if (cellData.state === "not-sprayed") {
        // A cell visited without confirmed spraying is a missed zone.
        cellData.state = "missed";
    }

    cellData.visits++;

    // Update the current worker cell.
    currentWorkerCell = { row, col };

    const currentCell = getGardenCell(row, col);

    if (currentCell) {
        currentCell.className = "garden-cell worker";
        currentCell.classList.add(cellData.state);

        currentCell.title =
            `Row ${row + 1}, Column ${col + 1}: ` +
            `${cellData.state.replace("-", " ")}`;

        currentCell.setAttribute("aria-label", currentCell.title);
    }

    updateCoverageStatistics();
}

/**
 * Find a grid cell using its row and column.
 */
function getGardenCell(row, col) {
    const grid = document.getElementById("gardenGrid");
    if (!grid) return null;

    return grid.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );
}

/**
 * Calculate and display coverage statistics.
 */
function updateCoverageStatistics() {
    let sprayed = 0;
    let missed = 0;
    let overlap = 0;

    gardenCoverage.forEach(row => {
        row.forEach(cell => {
            if (cell.state === "sprayed") sprayed++;
            if (cell.state === "missed") missed++;
            if (cell.state === "overlap") overlap++;
        });
    });

    const percentage = (sprayed + overlap) /
        TOTAL_GARDEN_CELLS * 100;

    const coverageElement = document.getElementById("coverage");
    const coverageBar = document.getElementById("coverageBar");
    const sprayingCoverage =
        document.getElementById("sprayingCoverage");

    if (coverageElement) {
        coverageElement.textContent = `${percentage.toFixed(1)}%`;
    }

    if (coverageBar) {
        coverageBar.style.width = `${percentage}%`;
        coverageBar.setAttribute(
            "aria-valuenow",
            percentage.toFixed(1)
        );
    }

    if (sprayingCoverage) {
        sprayingCoverage.textContent = `${percentage.toFixed(1)}%`;
    }

    // Demo assumption: each grid cell represents approximately 1 m².
    // Replace CELL_AREA_M2 after measuring the real garden geometry.
    setText("sprayedArea", `${((sprayed + overlap) * CELL_AREA_M2).toFixed(1)}`);
    setText("missedZones", missed);
    setText("overlapZones", overlap);

    const efficiency = sprayed + overlap > 0
        ? (sprayed / (sprayed + overlap)) * 100
        : 0;

    setText("efficiency", `${efficiency.toFixed(1)}%`);
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

/**
 * Reset the garden to its original state.
 */
function resetCoverage() {
    initializeCoverage();

    const coverageElement = document.getElementById("coverage");
    const coverageBar = document.getElementById("coverageBar");
    const sprayingCoverage =
        document.getElementById("sprayingCoverage");

    if (coverageElement) coverageElement.textContent = "0%";
    if (coverageBar) {
        coverageBar.style.width = "0%";
        coverageBar.setAttribute("aria-valuenow", "0");
    }
    if (sprayingCoverage) sprayingCoverage.textContent = "0%";

    setText("sprayedArea", "0.0");
    setText("missedZones", "0");
    setText("overlapZones", "0");
    setText("efficiency", "0.0%");
}

// Build the grid when the page loads.
initializeCoverage();

console.log("Virtual coverage module initialized.");
