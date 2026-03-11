/* ============================================================
   GRIDMIND EMS — state.js
   GridState object and Scenarios - single source of truth
   ============================================================ */

const GridState = {
  mode: 'SMART',
  scenario: 'SUNNY_DAY',
  solar_pct: 100,
  battery_soc: 82,
  grid_price: 0.08,
  load_kw: 1530,
  dispatch_mode: 'COST_MIN',
  analysis_method: 'NODAL',
  sources: { solar: true, wind: true, battery: false, grid: false },
  sim_minute: new Date().getHours() * 60 + new Date().getMinutes(),

  solar_kw: 0,
  wind_kw: 0,
  battery_avail: 0,
  total_renew: 0,
  total_gen: 0,
  grid_import: 0,
  curtail_risk: 0,
  renewable_pct: 0,
  cost_hr: 0,
  savings_pct: 0,
  soc_label: '',

  compute() {
    const h = Math.floor(this.sim_minute / 60) % 24;

    this.solar_kw = this.sources.solar
      ? (this.solar_pct / 100) * 1200
      : 0;

    this.wind_kw = this.sources.wind
      ? 300 + 180 * Math.sin((Math.PI * h) / 8)
      : 0;

    this.battery_avail = this.sources.battery && this.battery_soc > 20
      ? 365
      : 0;

    this.total_renew = this.solar_kw + this.wind_kw;
    this.total_gen = this.total_renew + this.battery_avail;

    this.grid_import = this.sources.grid
      ? Math.max(0, this.load_kw - this.total_gen)
      : 0;

    this.curtail_risk = this.total_gen > this.load_kw
      ? this.total_gen - this.load_kw
      : 0;

    this.renewable_pct = Math.min(100, Math.round((this.total_renew / this.load_kw) * 100));

    this.cost_hr = ((this.grid_import * this.grid_price) / 1000).toFixed(2);

    this.savings_pct = Math.round(
      (1 - (this.grid_price * this.grid_import) / (0.28 * this.load_kw)) * 100
    );

    if (this.battery_soc >= 90) {
      this.soc_label = '⚠️ Near Full';
    } else if (this.battery_soc >= 60) {
      this.soc_label = '✅ Optimal Dispatch';
    } else if (this.battery_soc >= 30) {
      this.soc_label = '🟡 Conservation Mode';
    } else {
      this.soc_label = '🔴 Critical — Grid Priority';
    }
  }
};

const Scenarios = {
  SUNNY_DAY: {
    label: '☀️ Sunny Day — Full Renewable',
    solar_pct: 100,
    battery_soc: 82,
    grid_price: 0.00,
    load_kw: 1530,
    sources: { solar: true, wind: true, battery: false, grid: false },
    accent: 'var(--accent-gold)',
    glow: 'var(--glow-gold)',
    grid_status: 'IDLE',
    log: '🟢 Scenario: Sunny Day. Solar at peak. Battery charging.',
    island_mode: false
  },
  PEAK_EVENING: {
    label: '🌆 Peak Evening — Battery + Grid',
    solar_pct: 0,
    battery_soc: 58,
    grid_price: 0.28,
    load_kw: 2800,
    sources: { solar: false, wind: true, battery: true, grid: true },
    accent: 'var(--accent-amber)',
    glow: 'var(--glow-amber)',
    grid_status: 'IMPORTING',
    log: '⚠️ Scenario: Peak Evening. Solar offline. EV Hub full load.',
    island_mode: false
  },
  GRID_FAILURE: {
    label: '🔴 Grid Failure — Islanded Microgrid',
    solar_pct: 70,
    battery_soc: 61,
    grid_price: 0.00,
    load_kw: 1430,
    sources: { solar: true, wind: true, battery: true, grid: false },
    accent: 'var(--accent-red)',
    glow: 'var(--glow-red)',
    grid_status: '⚡ DISCONNECTED — ISLAND MODE',
    log: '🔴 CRITICAL: Grid disconnected. Island mode active.',
    island_mode: true
  },
  OVERCAST: {
    label: '🌧️ Overcast — Grid Supplementing',
    solar_pct: 18,
    battery_soc: 71,
    grid_price: 0.16,
    load_kw: 1680,
    sources: { solar: true, wind: true, battery: true, grid: true },
    accent: 'var(--accent-blue-dim)',
    glow: 'rgba(123,158,196,0.3)',
    grid_status: 'SUPPLEMENTING',
    log: '🌧️ Scenario: Overcast. Solar at 18%. Grid supplementing.',
    island_mode: false
  }
};

function applyScenario(key) {
  const s = Scenarios[key];
  if (!s) return;

  GridState.scenario = key;
  GridState.solar_pct = s.solar_pct;
  GridState.battery_soc = s.battery_soc;
  GridState.grid_price = s.grid_price;
  GridState.load_kw = s.load_kw;
  GridState.sources = { ...s.sources };

  if (typeof addLogEntry === 'function') {
    addLogEntry(s.log);
  }

  if (typeof updateDashboard === 'function') {
    updateDashboard();
  }
}
