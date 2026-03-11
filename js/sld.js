/* ============================================================
   GRIDMIND EMS — sld.js
   SVG Single-Line Diagram rendering and animation
   ============================================================ */

function initSLD() {
  updateSLDFlowLines();
}

function updateSLDFlowLines() {
  const kwSolar = document.getElementById('kw-solar');
  const kwWind = document.getElementById('kw-wind');
  const kwBattery = document.getElementById('kw-battery');
  const kwGrid = document.getElementById('kw-grid');
  const kwLoad = document.getElementById('kw-load');
  const kwEv = document.getElementById('kw-ev');
  const kwBus = document.getElementById('kw-bus');

  if (kwSolar) kwSolar.textContent = Math.round(GridState.solar_kw) + ' kW';
  if (kwWind) kwWind.textContent = Math.round(GridState.wind_kw) + ' kW';
  if (kwBattery) kwBattery.textContent = Math.round(GridState.battery_avail) + ' kW';
  if (kwGrid) kwGrid.textContent = Math.round(GridState.grid_import) + ' kW';

  const facilityLoad = Math.round(GridState.load_kw * 0.81);
  const evLoad = Math.round(GridState.load_kw * 0.19);
  if (kwLoad) kwLoad.textContent = facilityLoad + ' kW';
  if (kwEv) kwEv.textContent = evLoad + ' kW';

  const busTotal = GridState.solar_kw + GridState.wind_kw + GridState.battery_avail + GridState.grid_import;
  if (kwBus) kwBus.textContent = Math.round(busTotal) + ' kW';

  updateFlowLine('flow-solar', GridState.solar_kw, GridState.sources.solar);
  updateFlowLine('flow-wind', GridState.wind_kw, GridState.sources.wind);
  updateFlowLine('flow-battery', GridState.battery_avail, GridState.sources.battery);
  updateFlowLine('flow-grid', GridState.grid_import, GridState.sources.grid);
  updateFlowLine('flow-load', facilityLoad, true);
  updateFlowLine('flow-ev', evLoad, true);

  const scenario = Scenarios[GridState.scenario];
  if (scenario && scenario.island_mode) {
    const gridNode = document.getElementById('node-grid');
    if (gridNode) gridNode.classList.add('dimmed');

    const gridFlow = document.getElementById('flow-grid');
    if (gridFlow) gridFlow.style.opacity = '0';
  } else {
    const gridNode = document.getElementById('node-grid');
    if (gridNode) gridNode.classList.remove('dimmed');

    const gridFlow = document.getElementById('flow-grid');
    if (gridFlow && GridState.sources.grid) {
      gridFlow.style.opacity = GridState.grid_import > 0 ? '1' : '0.3';
    }
  }
}

function updateFlowLine(id, kw, isActive) {
  const flowLine = document.getElementById(id);
  if (!flowLine) return;

  if (!isActive || kw === 0) {
    flowLine.style.opacity = '0.1';
    return;
  }

  flowLine.style.opacity = '1';

  const path = flowLine.querySelector('.flow-path');
  if (path) {
    const strokeWidth = mapRange(kw, 0, 1200, 0.5, 4);
    path.setAttribute('stroke-width', strokeWidth);
  }

  const dot = flowLine.querySelector('.flow-dot animateMotion');
  if (dot) {
    const duration = mapRange(kw, 0, 1200, 3, 0.8);
    dot.setAttribute('dur', duration + 's');
  }

  const label = flowLine.querySelector('.flow-label');
  if (label) {
    label.textContent = Math.round(kw) + ' kW';
  }
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
