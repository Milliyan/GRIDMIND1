/* ============================================================
   GRIDMIND EMS — dataEngine.js
   Simulation math and data generation functions
   ============================================================ */

const DataEngine = {
  getSolar(h) {
    return Math.max(0, 1200 * Math.sin((Math.PI * (h - 6)) / 12) * (0.88 + 0.12 * Math.random()));
  },

  getWind(h) {
    return 300 + 180 * Math.sin((Math.PI * h) / 8) + 60 * Math.random();
  },

  getLoad(h) {
    return 1500 + 800 * Math.sin((Math.PI * (h - 8)) / 10) + 150 * Math.random();
  },

  getSoC(h) {
    let base = 82 - (h > 14 ? (h - 14) * 2.5 : 0) + (h < 6 ? (6 - h) * 3.0 : 0);
    return Math.min(95, Math.max(15, base));
  },

  getPrice(h) {
    return h >= 14 && h <= 20 ? 0.28 : 0.08;
  },

  getFreq() {
    return 50.00 + (Math.random() - 0.5) * 0.06;
  },

  getSavings() {
    return [8, 10, 11, 13, 15, 16, 18];
  },

  getAnalysis(method) {
    const analyses = {
      NODAL: 'V₁=11.2V  V₂=9.8V  V₃=10.4V  V₄=10.1V',
      MESH: 'I₁=2.4A  I₂=1.8A  I₃=0.6A',
      THEVENIN: 'Vth=238V  |  Zth = 2.3+j1.7 Ω',
      NORTON: 'In=103.5A  |  Zn = 2.3+j1.7 Ω',
      SUPERPOSITION: 'V = 6.2V + 5.0V = 11.2V',
      MAX_POWER: 'R_L=2.3Ω  |  P_max=12.3kW  |  η=50%',
      MILLMAN: 'Vm = ΣVₖ/Zₖ ÷ Σ1/Zₖ = 10.8V'
    };
    return analyses[method] || '';
  },

  getForecastData() {
    const hours = [];
    const solar = [];
    const wind = [];
    const load = [];

    for (let h = 0; h < 24; h++) {
      hours.push(h + ':00');
      solar.push(this.getSolar(h));
      wind.push(this.getWind(h));
      load.push(this.getLoad(h));
    }

    return { hours, solar, wind, load };
  },

  getBatterySchedule() {
    const hours = [];
    const charge = [];
    const price = [];

    for (let h = 0; h < 24; h++) {
      hours.push(h + ':00');
      const p = this.getPrice(h);
      price.push(p);

      if (p < 0.15) {
        charge.push(Math.random() * 200 + 100);
      } else if (p > 0.2) {
        charge.push(-(Math.random() * 300 + 150));
      } else {
        charge.push(0);
      }
    }

    return { hours, charge, price };
  },

  getSoCHistory() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const socValues = [78, 82, 75, 80, 85, 79, 82];
    return { days, socValues };
  },

  getVoltageProfile() {
    return {
      buses: ['Bus 1', 'Bus 2', 'Bus 3', 'Bus 4', 'Bus 5'],
      voltages: [1.02, 0.98, 1.01, 0.99, 1.00]
    };
  }
};
