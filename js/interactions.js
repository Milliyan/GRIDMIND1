/* ============================================================
   GRIDMIND EMS — interactions.js
   All event listeners and user interaction handlers
   ============================================================ */

let currentTab = 'tab-forecast';

function initInteractions() {
  initScenarioButtons();
  initSliders();
  initModeToggle();
  initAnalysisToggles();
  initDispatchChips();
  initTabSwitching();
  initManualSourceToggles();
  initDiagramControls();
  initHelpModal();
}

function initScenarioButtons() {
  document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      applyScenario(card.dataset.scenario);
    });
  });
}

function initSliders() {
  const sliderSolar = document.getElementById('slider-solar');
  if (sliderSolar) {
    sliderSolar.addEventListener('input', (e) => {
      GridState.solar_pct = +e.target.value;
      updateDashboard();
      if (GridState.solar_pct === 0) {
        addLogEntry('⚠️ Solar at 0%. Grid compensating. $' + GridState.grid_price.toFixed(2) + '/kWh');
      }
    });
  }

  const sliderSoc = document.getElementById('slider-soc');
  if (sliderSoc) {
    sliderSoc.addEventListener('input', (e) => {
      GridState.battery_soc = +e.target.value;
      updateDashboard();
    });
  }

  const sliderPrice = document.getElementById('slider-price');
  if (sliderPrice) {
    sliderPrice.addEventListener('input', (e) => {
      GridState.grid_price = (+e.target.value) / 100;
      updateDashboard();
      if (GridState.grid_price > 0.25) {
        addLogEntry('💰 High price: $' + GridState.grid_price.toFixed(2) + '/kWh. Battery priority.');
      }
    });
  }

  const sliderLoad = document.getElementById('slider-load');
  if (sliderLoad) {
    sliderLoad.addEventListener('input', (e) => {
      GridState.load_kw = +e.target.value;
      updateDashboard();
    });
  }
}

function initModeToggle() {
  const btnSmart = document.getElementById('btn-smart');
  const btnManual = document.getElementById('btn-manual');

  if (btnSmart) {
    btnSmart.addEventListener('click', () => {
      GridState.mode = 'SMART';
      btnSmart.classList.add('active');
      btnManual.classList.remove('active');
      updateModeUI();
      addLogEntry('🤖 Smart Mode restored. Resuming merit order dispatch.');
    });
  }

  if (btnManual) {
    btnManual.addEventListener('click', () => {
      GridState.mode = 'MANUAL';
      btnManual.classList.add('active');
      btnSmart.classList.remove('active');
      updateModeUI();
      addLogEntry('🖐️ Manual Override. Optimizer suspended. Awaiting input.');
    });
  }
}

function initAnalysisToggles() {
  document.querySelectorAll('.analysis-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      document.querySelectorAll('.analysis-toggle').forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');

      const method = toggle.dataset.method;
      GridState.analysis_method = method;

      const outputPanel = document.getElementById('method-output-panel');
      if (outputPanel) {
        outputPanel.style.opacity = '0';
        setTimeout(() => {
          outputPanel.textContent = DataEngine.getAnalysis(method);
          outputPanel.style.opacity = '1';
        }, 150);
      }

      const kpiAnalysis = document.getElementById('kpi-analysis');
      if (kpiAnalysis) kpiAnalysis.textContent = method;

      const activeMethodLabel = document.getElementById('active-method-label');
      if (activeMethodLabel) activeMethodLabel.textContent = 'Active: ' + method;

      const helpActiveMethod = document.getElementById('help-active-method');
      if (helpActiveMethod) helpActiveMethod.textContent = method;

      addLogEntry('🔬 Analysis → ' + method + '. ' + DataEngine.getAnalysis(method));

      if (currentTab === 'tab-lab') {
        renderAnalysisLab();
      }
    });
  });
}

function initDispatchChips() {
  document.querySelectorAll('.dispatch-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.dispatch-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      GridState.dispatch_mode = chip.dataset.mode;
      updateDashboard();
      addLogEntry('⚙️ Dispatch mode: ' + chip.dataset.mode);
    });
  });
}

function initTabSwitching() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.dataset.tab;
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');

      currentTab = target;

      if (target === 'tab-lab') {
        renderAnalysisLab();
      }
    });
  });
}

function initManualSourceToggles() {
  document.querySelectorAll('.source-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const source = toggle.dataset.source;
      GridState.sources[source] = !GridState.sources[source];

      if (GridState.sources[source]) {
        toggle.classList.add('on');
        addLogEntry('✅ ' + source.toUpperCase() + ' enabled');
      } else {
        toggle.classList.remove('on');
        addLogEntry('⛔ ' + source.toUpperCase() + ' disabled');
      }

      updateDashboard();
    });
  });
}

function initDiagramControls() {
  const btnPause = document.getElementById('btn-pause');
  if (btnPause) {
    let isPaused = false;
    btnPause.addEventListener('click', () => {
      isPaused = !isPaused;
      document.querySelectorAll('.flow-dot animateMotion').forEach(anim => {
        const parent = anim.parentElement;
        if (parent) {
          if (isPaused) {
            parent.style.animationPlayState = 'paused';
          } else {
            parent.style.animationPlayState = 'running';
          }
        }
      });
      btnPause.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
    });
  }

  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      applyScenario('SUNNY_DAY');
      document.getElementById('sc-sunny').classList.add('active');
      addLogEntry('🔄 System reset to Sunny Day scenario');
    });
  }

  const btnImpedances = document.getElementById('btn-impedances');
  if (btnImpedances) {
    btnImpedances.addEventListener('click', () => {
      const canvas = document.getElementById('sld-canvas');
      if (canvas) {
        canvas.classList.toggle('show-impedances');
      }
    });
  }
}

function initHelpModal() {
  const btnHelp = document.getElementById('btn-help');
  const modal = document.getElementById('help-modal');
  const modalClose = document.getElementById('modal-close');

  if (btnHelp) {
    btnHelp.addEventListener('click', () => {
      if (modal) modal.classList.add('open');
    });
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      if (modal) modal.classList.remove('open');
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal) {
      modal.classList.remove('open');
    }
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }
}
