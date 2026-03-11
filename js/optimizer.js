/* ============================================================
   GRIDMIND EMS — optimizer.js
   Merit order dispatch and optimization logic
   ============================================================ */

function runOptimizerStep() {
  if (GridState.mode !== 'SMART') return;

  const h = Math.floor(GridState.sim_minute / 60) % 24;

  if (GridState.dispatch_mode === 'COST_MIN') {
    if (GridState.curtail_risk > 50 && GridState.battery_soc < 90) {
      GridState.battery_soc = Math.min(100, GridState.battery_soc + 0.5);
      if (typeof addLogEntry === 'function') {
        addLogEntry('🔋 Surplus +' + Math.round(GridState.curtail_risk) + 'kW — Battery charging');
      }
    }

    if (h >= 14 && h <= 20 && GridState.battery_soc > 30) {
      if (typeof addLogEntry === 'function') {
        addLogEntry('🔋 Peak hour — Battery dispatched. Grid minimized.');
      }
    }

    if (GridState.grid_import > 500) {
      if (typeof addLogEntry === 'function') {
        addLogEntry('⚠️  Grid import high: ' + Math.round(GridState.grid_import) + 'kW at $' + GridState.grid_price.toFixed(2) + '/kWh');
      }
    }
  }

  if (GridState.dispatch_mode === 'CARBON_MIN') {
    if (GridState.grid_import > 200) {
      if (typeof addLogEntry === 'function') {
        addLogEntry('🌿 Carbon mode: grid ' + Math.round(GridState.grid_import) + 'kW. Increasing battery dispatch.');
      }
    }

    if (typeof addLogEntry === 'function' && Math.random() < 0.3) {
      addLogEntry('🌿 Renewable: ' + GridState.renewable_pct + '% — CO₂ optimized');
    }
  }

  if (GridState.dispatch_mode === 'PEAK_SHAVE') {
    if (GridState.load_kw > 2500) {
      if (typeof addLogEntry === 'function') {
        addLogEntry('⚡ Peak Shave — Load ' + GridState.load_kw + 'kW > 2500kW. Battery engaged.');
      }
    }
  }

  GridState.sim_minute += 1;

  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }
}

function getMeritOrder() {
  const sources = [];

  if (GridState.sources.solar && GridState.solar_kw > 0) {
    sources.push({
      rank: 1,
      name: '☀️ Solar',
      cost: 0.00,
      available: Math.round(GridState.solar_kw),
      status: 'DISPATCHED'
    });
  }

  if (GridState.sources.wind && GridState.wind_kw > 0) {
    sources.push({
      rank: 2,
      name: '💨 Wind',
      cost: 0.00,
      available: Math.round(GridState.wind_kw),
      status: 'DISPATCHED'
    });
  }

  if (GridState.sources.battery && GridState.battery_avail > 0) {
    sources.push({
      rank: 3,
      name: '🔋 Battery',
      cost: 0.05,
      available: Math.round(GridState.battery_avail),
      status: GridState.battery_soc > 30 ? 'STANDBY' : 'LIMITED'
    });
  }

  if (GridState.sources.grid) {
    sources.push({
      rank: 4,
      name: '🔌 Grid',
      cost: GridState.grid_price,
      available: Math.round(GridState.grid_import),
      status: GridState.grid_import > 0 ? 'IMPORTING' : 'IDLE'
    });
  }

  return sources.sort((a, b) => a.cost - b.cost || a.rank - b.rank);
}
