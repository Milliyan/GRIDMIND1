/* ============================================================
   GRIDMIND EMS — ui.js
   DOM update functions and UI state management
   ============================================================ */

function updateDashboard() {
  GridState.compute();
  updateAllKPICards();
  updateBatteryGauge();
  updateSLDFlowLines();
  updateMeritOrderTable();
  updateAllCharts();
  updateIslandModeAlert();
  updateManualSourceToggles();
  updateSliderDisplayValues();
  updateModeUI();
}

function updateAllKPICards() {
  const kpiFreq = document.getElementById('kpi-freq');
  if (kpiFreq) {
    kpiFreq.textContent = DataEngine.getFreq().toFixed(2) + ' Hz';
  }

  const kpiRenew = document.getElementById('kpi-renew');
  const kpiRenewBar = document.getElementById('kpi-renew-bar');
  if (kpiRenew) kpiRenew.textContent = GridState.renewable_pct + '%';
  if (kpiRenewBar) kpiRenewBar.style.width = GridState.renewable_pct + '%';

  const kpiAnalysis = document.getElementById('kpi-analysis');
  if (kpiAnalysis) kpiAnalysis.textContent = GridState.analysis_method;

  const activeMethodLabel = document.getElementById('active-method-label');
  if (activeMethodLabel) activeMethodLabel.textContent = 'Active: ' + GridState.analysis_method;

  const helpActiveMethod = document.getElementById('help-active-method');
  if (helpActiveMethod) helpActiveMethod.textContent = GridState.analysis_method;

  const savingsToday = document.getElementById('savings-today');
  if (savingsToday) savingsToday.textContent = '$' + (Math.random() * 30 + 20).toFixed(2);

  const curtailmentFill = document.getElementById('curtailment-fill');
  const curtailmentValue = document.getElementById('curtailment-value');
  if (curtailmentFill && curtailmentValue) {
    const curtailPct = Math.min(100, (GridState.curtail_risk / 500) * 100);
    curtailmentFill.style.width = curtailPct + '%';
    curtailmentValue.textContent = Math.round(GridState.curtail_risk) + ' kW';
  }
}

function updateBatteryGauge() {
  const socValue = document.getElementById('soc-value');
  const socLabel = document.getElementById('soc-label');
  const gaugeArc = document.getElementById('gauge-arc');

  if (socValue) socValue.textContent = GridState.battery_soc;
  if (socLabel) socLabel.textContent = GridState.soc_label;

  if (gaugeArc) {
    const circumference = 2 * Math.PI * 70;
    const dashArray = (circumference * 270) / 360;
    const offset = dashArray - (dashArray * GridState.battery_soc) / 100;
    gaugeArc.style.strokeDasharray = dashArray;
    gaugeArc.style.strokeDashoffset = offset;

    if (GridState.battery_soc < 30) {
      gaugeArc.style.stroke = '#FF4B4B';
    } else if (GridState.battery_soc < 60) {
      gaugeArc.style.stroke = '#FF9900';
    } else if (GridState.battery_soc > 90) {
      gaugeArc.style.stroke = '#FF9900';
    } else {
      gaugeArc.style.stroke = '#00E87A';
    }
  }
}

function animateSoCGaugeOnLoad(targetSoc) {
  const gaugeArc = document.getElementById('gauge-arc');
  if (!gaugeArc) return;

  const circumference = 2 * Math.PI * 70;
  const dashArray = (circumference * 270) / 360;

  gaugeArc.style.strokeDasharray = dashArray;
  gaugeArc.style.strokeDashoffset = dashArray;

  setTimeout(() => {
    const offset = dashArray - (dashArray * targetSoc) / 100;
    gaugeArc.style.strokeDashoffset = offset;
  }, 100);
}

function updateMeritOrderTable() {
  const tbody = document.getElementById('merit-tbody');
  if (!tbody) return;

  const meritOrder = getMeritOrder();
  tbody.innerHTML = '';

  meritOrder.forEach((source, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${source.name}</td>
      <td>$${source.cost.toFixed(2)}</td>
      <td>${source.available} kW</td>
      <td><span style="color: ${getStatusColor(source.status)}">${source.status}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function getStatusColor(status) {
  if (status === 'DISPATCHED') return '#00E87A';
  if (status === 'IMPORTING') return '#FF9900';
  if (status === 'STANDBY') return '#00E5CC';
  if (status === 'LIMITED') return '#FF9900';
  return '#4A6A8A';
}

function updateIslandModeAlert() {
  const alert = document.getElementById('island-alert');
  if (!alert) return;

  const scenario = Scenarios[GridState.scenario];
  if (scenario && scenario.island_mode) {
    alert.style.display = 'flex';
  } else {
    alert.style.display = 'none';
  }
}

function updateManualSourceToggles() {
  const panel = document.getElementById('manual-source-panel');
  if (!panel) return;

  const toggles = panel.querySelectorAll('.source-toggle');
  toggles.forEach(toggle => {
    const source = toggle.dataset.source;
    if (GridState.sources[source]) {
      toggle.classList.add('on');
    } else {
      toggle.classList.remove('on');
    }
  });
}

function updateSliderDisplayValues() {
  const solarValue = document.getElementById('solar-value');
  const socValueSlider = document.getElementById('soc-value-slider');
  const priceValue = document.getElementById('price-value');
  const loadValue = document.getElementById('load-value');

  if (solarValue) solarValue.textContent = GridState.solar_pct + '%';
  if (socValueSlider) socValueSlider.textContent = GridState.battery_soc + '%';
  if (priceValue) priceValue.textContent = '$' + GridState.grid_price.toFixed(2);
  if (loadValue) loadValue.textContent = GridState.load_kw + ' kW';

  const sliderSolar = document.getElementById('slider-solar');
  const sliderSoc = document.getElementById('slider-soc');
  const sliderPrice = document.getElementById('slider-price');
  const sliderLoad = document.getElementById('slider-load');

  if (sliderSolar) sliderSolar.value = GridState.solar_pct;
  if (sliderSoc) sliderSoc.value = GridState.battery_soc;
  if (sliderPrice) sliderPrice.value = GridState.grid_price * 100;
  if (sliderLoad) sliderLoad.value = GridState.load_kw;
}

function updateModeUI() {
  const modeStatus = document.getElementById('mode-status-label');
  const manualPanel = document.getElementById('manual-source-panel');

  if (GridState.mode === 'SMART') {
    if (modeStatus) modeStatus.textContent = 'Smart Optimizer Active';
    if (manualPanel) manualPanel.style.display = 'none';
  } else {
    if (modeStatus) modeStatus.textContent = 'Manual Override — Optimizer Paused';
    if (manualPanel) manualPanel.style.display = 'block';
  }
}

function addLogEntry(msg) {
  const log = document.getElementById('optimizer-log');
  if (!log) return;

  const now = new Date();
  const timestamp = now.toTimeString().slice(0, 8);
  const entry = document.createElement('div');

  let colorClass = '';
  if (msg.startsWith('🟢')) colorClass = 'log-green';
  else if (msg.startsWith('🔋')) colorClass = 'log-teal';
  else if (msg.startsWith('⚠️')) colorClass = 'log-amber';
  else if (msg.startsWith('🔴')) colorClass = 'log-red';
  else if (msg.startsWith('🌿')) colorClass = 'log-green';

  entry.className = colorClass;
  entry.textContent = `[${timestamp}] ${msg}`;

  log.insertBefore(entry, log.firstChild);

  const entries = log.children;
  if (entries.length > 50) {
    log.removeChild(entries[entries.length - 1]);
  }
}

function animateCountUp(element, targetValue, unit = '', duration = 600) {
  if (!element) return;

  const startValue = parseFloat(element.textContent) || 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const currentValue = startValue + (targetValue - startValue) * progress;
    element.textContent = currentValue.toFixed(0) + unit;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function renderAnalysisLab() {
  const lab = document.getElementById('analysis-lab');
  if (!lab) return;

  const method = GridState.analysis_method;
  const analysisData = DataEngine.getAnalysis(method);

  let content = `
    <h3 class="panel-title">Circuit Analysis: ${method}</h3>
    <div class="analysis-content">
  `;

  switch (method) {
    case 'NODAL':
      content += `
        <p class="analysis-intro">Nodal analysis applies Kirchhoff's Current Law (KCL) at each node to solve for bus voltages.</p>
        <div class="analysis-equations">
          <div class="equation-line">Y<sub>bus</sub> × V = I</div>
          <div class="equation-line">${analysisData}</div>
        </div>
      `;
      break;

    case 'MESH':
      content += `
        <p class="analysis-intro">Mesh analysis applies Kirchhoff's Voltage Law (KVL) around each loop to solve for mesh currents.</p>
        <div class="analysis-equations">
          <div class="equation-line">Z<sub>mesh</sub> × I = V</div>
          <div class="equation-line">${analysisData}</div>
        </div>
      `;
      break;

    case 'THEVENIN':
      content += `
        <p class="analysis-intro">Thevenin's theorem reduces a circuit to an equivalent voltage source in series with an impedance.</p>
        <div class="analysis-equations">
          <div class="equation-line">${analysisData}</div>
          <div class="equation-line">R<sub>L</sub> for max power = |Zth|</div>
        </div>
      `;
      break;

    case 'NORTON':
      content += `
        <p class="analysis-intro">Norton's theorem reduces a circuit to an equivalent current source in parallel with an impedance.</p>
        <div class="analysis-equations">
          <div class="equation-line">${analysisData}</div>
          <div class="equation-line">In = Vth / Zth</div>
        </div>
      `;
      break;

    case 'SUPERPOSITION':
      content += `
        <p class="analysis-intro">Superposition analyzes each source independently, then sums the results (linear circuits only).</p>
        <div class="analysis-equations">
          <div class="equation-line">${analysisData}</div>
          <div class="equation-line">V<sub>total</sub> = ΣV<sub>i</sub></div>
        </div>
      `;
      break;

    case 'MAX_POWER':
      content += `
        <p class="analysis-intro">Maximum power transfer occurs when load impedance matches source impedance (50% efficiency).</p>
        <div class="analysis-equations">
          <div class="equation-line">${analysisData}</div>
          <div class="equation-line">P<sub>max</sub> = V<sup>2</sup> / (4R<sub>th</sub>)</div>
        </div>
      `;
      break;

    case 'MILLMAN':
      content += `
        <p class="analysis-intro">Millman's theorem combines parallel voltage sources into a single equivalent source.</p>
        <div class="analysis-equations">
          <div class="equation-line">${analysisData}</div>
          <div class="equation-line">Valid for parallel voltage sources with series impedances</div>
        </div>
      `;
      break;
  }

  content += `</div>`;

  lab.innerHTML = content;
  lab.style.opacity = '0';
  setTimeout(() => {
    lab.style.opacity = '1';
  }, 50);
}
