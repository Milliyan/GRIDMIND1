/* ============================================================
   GRIDMIND EMS — main.js
   Application entry point - initializes all systems
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  console.log('⚡ GRIDMIND EMS v4.0 Initializing...');

  initAllCharts();
  console.log('✓ Charts initialized');

  initSLD();
  console.log('✓ Single-Line Diagram initialized');

  applyScenario('SUNNY_DAY');
  const scSunny = document.getElementById('sc-sunny');
  if (scSunny) scSunny.classList.add('active');
  console.log('✓ Default scenario loaded: SUNNY_DAY');

  initInteractions();
  console.log('✓ Event listeners initialized');

  function updateClock() {
    const now = new Date();
    const clock = document.getElementById('clock');
    if (clock) {
      clock.textContent = now.toTimeString().slice(0, 8);
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
  console.log('✓ Live clock started');

  let co2 = 4.2;
  setInterval(() => {
    co2 += 0.001;
    const co2Counter = document.getElementById('co2-counter');
    if (co2Counter) {
      co2Counter.textContent = 'CO₂ Saved: ' + co2.toFixed(3) + ' t';
    }
  }, 2000);
  console.log('✓ CO₂ counter started');

  setInterval(() => {
    const freq = DataEngine.getFreq().toFixed(2);
    const freqBadge = document.getElementById('freq-badge');
    if (freqBadge) {
      const valueSpan = freqBadge.querySelector('.value');
      if (valueSpan) {
        valueSpan.textContent = freq + ' Hz';
      }
    }
  }, 1500);
  console.log('✓ Frequency monitor started');

  setInterval(runOptimizerStep, 3000);
  console.log('✓ Optimizer loop started (3s interval)');

  animateSoCGaugeOnLoad(82);
  console.log('✓ Battery SOC gauge animated');

  addLogEntry('🟢 GRIDMIND EMS v4.0 — System Online');
  addLogEntry('⚡ All subsystems initialized. Smart optimizer active.');

  console.log('⚡ GRIDMIND EMS v4.0 — Ready!');
});
