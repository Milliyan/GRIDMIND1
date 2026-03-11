/* ============================================================
   GRIDMIND EMS — charts.js
   All Chart.js chart instances and update functions
   ============================================================ */

let savingsChart, forecastChart, scheduleChart, socHistoryChart, freqChart, voltageChart;

function initAllCharts() {
  initSavingsChart();
  initForecastChart();
  initBatteryCharts();
  initHealthCharts();
}

function initSavingsChart() {
  const ctx = document.getElementById('chart-savings');
  if (!ctx) return;

  savingsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['6h', '8h', '10h', '12h', '14h', '16h', '18h'],
      datasets: [{
        label: 'Savings %',
        data: DataEngine.getSavings(),
        borderColor: '#39FF6A',
        backgroundColor: 'rgba(57,255,106,0.08)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#39FF6A'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(13,26,46,0.95)',
          titleColor: '#E8F4FD',
          bodyColor: '#E8F4FD',
          borderColor: '#00E5CC',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#4A6A8A', callback: (v) => v + '%' }
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#4A6A8A' }
        }
      }
    }
  });
}

function initForecastChart() {
  const ctx = document.getElementById('chart-forecast');
  if (!ctx) return;

  const data = DataEngine.getForecastData();

  forecastChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.hours,
      datasets: [
        {
          label: 'Solar',
          data: data.solar,
          borderColor: '#FFB830',
          backgroundColor: 'rgba(255,184,48,0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Wind',
          data: data.wind,
          borderColor: '#00E5CC',
          backgroundColor: 'rgba(0,229,204,0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Load',
          data: data.load,
          borderColor: '#E8F4FD',
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { color: '#E8F4FD', font: { family: 'DM Sans', size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(13,26,46,0.95)',
          titleColor: '#E8F4FD',
          bodyColor: '#E8F4FD',
          borderColor: '#00E5CC',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#4A6A8A', callback: (v) => v + ' kW' }
        },
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#4A6A8A' }
        }
      }
    }
  });
}

function initBatteryCharts() {
  const scheduleCtx = document.getElementById('chart-schedule');
  if (scheduleCtx) {
    const batteryData = DataEngine.getBatterySchedule();

    scheduleChart = new Chart(scheduleCtx, {
      type: 'bar',
      data: {
        labels: batteryData.hours,
        datasets: [{
          label: 'Charge/Discharge (kW)',
          data: batteryData.charge,
          backgroundColor: (context) => {
            const value = context.parsed.y;
            return value > 0 ? 'rgba(0,232,122,0.6)' : 'rgba(255,75,75,0.6)';
          },
          borderColor: (context) => {
            const value = context.parsed.y;
            return value > 0 ? '#00E87A' : '#FF4B4B';
          },
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,26,46,0.95)',
            titleColor: '#E8F4FD',
            bodyColor: '#E8F4FD',
            borderColor: '#00E5CC',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#4A6A8A', callback: (v) => v + ' kW' }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#4A6A8A' }
          }
        }
      }
    });
  }

  const socCtx = document.getElementById('chart-soc-history');
  if (socCtx) {
    const socData = DataEngine.getSoCHistory();

    socHistoryChart = new Chart(socCtx, {
      type: 'line',
      data: {
        labels: socData.days,
        datasets: [{
          label: 'SOC %',
          data: socData.socValues,
          borderColor: '#00E87A',
          backgroundColor: 'rgba(0,232,122,0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#00E87A'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,26,46,0.95)',
            titleColor: '#E8F4FD',
            bodyColor: '#E8F4FD',
            borderColor: '#00E5CC',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 70,
            max: 90,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#4A6A8A', callback: (v) => v + '%' }
          },
          x: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#4A6A8A' }
          }
        }
      }
    });
  }
}

function initHealthCharts() {
  const freqCtx = document.getElementById('chart-freq');
  if (freqCtx) {
    freqChart = new Chart(freqCtx, {
      type: 'doughnut',
      data: {
        labels: ['Current', 'Range'],
        datasets: [{
          data: [50.00, 0.50],
          backgroundColor: ['#00E87A', 'rgba(255,255,255,0.05)'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  }

  const voltageCtx = document.getElementById('chart-voltage');
  if (voltageCtx) {
    const voltageData = DataEngine.getVoltageProfile();

    voltageChart = new Chart(voltageCtx, {
      type: 'bar',
      data: {
        labels: voltageData.buses,
        datasets: [{
          label: 'Voltage (p.u.)',
          data: voltageData.voltages,
          backgroundColor: (context) => {
            const value = context.parsed.y;
            if (value < 0.95 || value > 1.05) return 'rgba(255,75,75,0.6)';
            if (value < 0.98 || value > 1.02) return 'rgba(255,153,0,0.6)';
            return 'rgba(0,232,122,0.6)';
          },
          borderColor: (context) => {
            const value = context.parsed.y;
            if (value < 0.95 || value > 1.05) return '#FF4B4B';
            if (value < 0.98 || value > 1.02) return '#FF9900';
            return '#00E87A';
          },
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(13,26,46,0.95)',
            titleColor: '#E8F4FD',
            bodyColor: '#E8F4FD',
            borderColor: '#00E5CC',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            min: 0.90,
            max: 1.10,
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { color: '#4A6A8A' }
          },
          y: {
            grid: { display: false },
            ticks: { color: '#4A6A8A' }
          }
        }
      }
    });
  }

  initWaveform();
}

function initWaveform() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let harmonics = 0;

  function drawWaveform() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#00E5CC';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < canvas.width; x++) {
      const angle = (x / canvas.width) * Math.PI * 4;
      let y = Math.sin(angle);

      if (harmonics > 0) {
        y += Math.sin(angle * 3) * 0.2 * harmonics;
        y += Math.sin(angle * 5) * 0.1 * harmonics;
      }

      const yPos = canvas.height / 2 + (y * canvas.height * 0.35);

      if (x === 0) {
        ctx.moveTo(x, yPos);
      } else {
        ctx.lineTo(x, yPos);
      }
    }

    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }

  drawWaveform();

  const btnDisturb = document.getElementById('btn-disturb');
  const btnCompensate = document.getElementById('btn-compensate');
  const thdLabel = document.getElementById('thd-label');

  if (btnDisturb) {
    btnDisturb.addEventListener('click', () => {
      harmonics = Math.min(1, harmonics + 0.3);
      drawWaveform();
      if (thdLabel) thdLabel.textContent = 'THD: ' + (1.2 + harmonics * 12).toFixed(1) + '%';
    });
  }

  if (btnCompensate) {
    btnCompensate.addEventListener('click', () => {
      harmonics = Math.max(0, harmonics - 0.3);
      drawWaveform();
      if (thdLabel) thdLabel.textContent = 'THD: ' + (1.2 + harmonics * 12).toFixed(1) + '%';
    });
  }
}

function updateAllCharts() {
  if (savingsChart) {
    savingsChart.data.datasets[0].data[6] = GridState.savings_pct;
    savingsChart.update('none');
  }
}
