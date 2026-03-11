# GRIDMIND EMS ⚡

> Cloud-based Microgrid Energy Management System

## Live Demo

🚀 [Deploy your own instance on Vercel](https://vercel.com/new)

## Overview

GRIDMIND EMS is a professional-grade, interactive dashboard for microgrid energy management systems, designed for engineering conference presentations and educational demonstrations. Built with pure HTML/CSS/JavaScript, it showcases real-time power flow visualization, economic dispatch optimization, and seven circuit analysis methods in a stunning, production-ready interface.

This system simulates the intelligent brain of a smart power grid, demonstrating how modern energy management systems balance renewable generation, battery storage, grid imports, and load demands while minimizing costs and maximizing sustainability.

## Features

### Core Functionality
- **Animated Single-Line Diagram** with real-time power flow visualization using SVG animateMotion
- **7 Circuit Analysis Methods**: Nodal, Mesh, Thevenin, Norton, Superposition, Max Power Transfer, and Millman's Theorem
- **4 Grid Scenario Presets**: Sunny Day, Peak Evening, Grid Failure (Island Mode), and Overcast conditions
- **Live Parameter Sliders**: Real-time control of solar intensity, battery SOC, grid price, and load demand
- **Manual vs Smart Optimizer** mode toggle with merit order economic dispatch
- **Economic Dispatch Engine** with cost minimization, carbon minimization, and peak shaving strategies
- **Grid Health Monitor**: Frequency, voltage profile, THD, power factor, and waveform analysis
- **Battery Intelligence**: Arbitrage savings calculator, charge/discharge scheduling, SOC forecasting

### Interactive Components
- Real-time telemetry dashboard with live clock, frequency monitor, and CO₂ counter
- Radial battery SOC gauge with zone-based coloring
- Merit order dispatch table with dynamic source ranking
- 24-hour load and generation forecast charts
- Comprehensive circuit analysis laboratory with method-specific visualizations
- Island mode alert system with dramatic visual effects
- Source control toggles for manual grid operation

## Tech Stack

- **Pure HTML5** / **CSS3** / **Vanilla JavaScript** (zero frameworks)
- **Chart.js** (CDN) for all data visualizations and gauges
- **SVG animateMotion** for power flow animations
- **CSS Grid** and **Flexbox** for responsive bento layout
- **Glass morphism** design system with custom CSS variables
- No build tools, no npm dependencies, no compilation required

## File Structure

```
gridmind-ems/
│
├── index.html                  # Entry point with complete HTML structure
├── vercel.json                 # Vercel static site deployment config
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
│
├── css/
│   ├── variables.css           # CSS variables, colors, fonts, global resets
│   ├── layout.css              # Bento grid layout, topbar, sidebar, panels
│   ├── components.css          # Glass cards, buttons, sliders, badges
│   ├── sld.css                 # Single-line diagram specific styles
│   ├── charts.css              # Chart.js container and chart wrapper styles
│   ├── animations.css          # All @keyframes and animation definitions
│   └── tabs.css                # Analysis tab bar and panel styles
│
├── js/
│   ├── state.js                # GridState object and Scenarios definitions
│   ├── dataEngine.js           # Simulation math and data generation
│   ├── optimizer.js            # Merit order dispatch and optimization logic
│   ├── sld.js                  # SVG diagram rendering and animation
│   ├── charts.js               # All Chart.js chart instances
│   ├── ui.js                   # DOM update functions and UI state management
│   ├── interactions.js         # All event listeners and user interactions
│   └── main.js                 # Entry point that initializes the application
│
└── assets/
    └── favicon.svg             # Lightning bolt favicon
```

## Local Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, or Safari)
- Optional: A local web server for testing

### Quick Start

```bash
# Clone the repository
git clone https://github.com/[username]/gridmind-ems.git
cd gridmind-ems

# No npm install needed — this is a pure static site

# Option 1: Open directly in browser (may have CORS limitations)
open index.html

# Option 2: Use a local server (recommended)
npx serve .
# Then visit http://localhost:3000

# Option 3: Use Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 4: Use PHP's built-in server
php -S localhost:8000
# Then visit http://localhost:8000
```

## Deploy to Vercel

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
vercel

# Follow the prompts:
#   - Set up and deploy? → Y
#   - Which scope? → [your account]
#   - Link to existing project? → N
#   - Project name → gridmind-ems
#   - Directory → ./
#   - Override settings? → N

# Your site is now live!
# Production URL will be displayed in terminal
```

### Option B: Vercel Dashboard (No CLI Required)

1. Push this repository to GitHub
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Click "Import Git Repository"
4. Select your `gridmind-ems` repository
5. Configure project:
   - Framework Preset: **Other** (leave as default)
   - Build Command: **(leave EMPTY)**
   - Output Directory: **(leave EMPTY or `.`)**
6. Click **Deploy**
7. Your site will be live in ~30 seconds at `https://gridmind-ems.vercel.app`

### Option C: GitHub Pages (Alternative)

1. Push to GitHub
2. Go to repository Settings → Pages
3. Source: **main branch** / **root**
4. Save
5. Site will be live at: `https://[username].github.io/gridmind-ems`

### Future Updates

```bash
# Make your changes to any files
git add .
git commit -m "feat: description of changes"
git push

# Vercel auto-deploys on every push to main branch
# No manual redeployment needed!
```

## Engineering Background

### Smart Grid Optimization

Modern microgrids require intelligent energy management to balance four competing objectives:

1. **Economic Dispatch**: Minimize operating costs by dispatching sources in merit order (lowest $/kWh first)
2. **Load Forecasting**: Predict demand patterns to enable optimal resource scheduling
3. **Battery Intelligence**: Time-shift energy to capture arbitrage opportunities during peak/off-peak pricing
4. **Renewable Integration**: Maximize clean energy penetration while maintaining grid stability

GRIDMIND EMS demonstrates these principles through an interactive simulation engine that updates in real-time as parameters change.

### Seven Circuit Analysis Methods

The dashboard includes a complete circuit analysis laboratory demonstrating fundamental electrical engineering techniques:

| Method | Description | Use Case |
|--------|-------------|----------|
| **NODAL** | Solves for node voltages using Kirchhoff's Current Law (KCL) at each bus | Voltage drop analysis |
| **MESH** | Solves for loop currents using Kirchhoff's Voltage Law (KVL) | Current distribution |
| **THEVENIN** | Reduces circuit to equivalent voltage source + series impedance | Load analysis |
| **NORTON** | Reduces circuit to equivalent current source + parallel impedance | Source equivalence |
| **SUPERPOSITION** | Analyzes each source independently, then sums results | Multi-source systems |
| **MAX POWER** | Finds load impedance for maximum power transfer (η = 50%) | Load matching |
| **MILLMAN** | Combines parallel voltage sources into single equivalent | Parallel sources |

Each method is selectable via the left sidebar and updates the analysis output panel in real-time.

## Conference Demo Script

Perfect 5-minute demonstration sequence for engineering presentations:

1. **Default View** (0:00 - 0:30)
   - Loads Sunny Day scenario automatically
   - Full renewable generation visible with gold/emerald flow lines
   - Point out the animated power flow and real-time telemetry

2. **Grid Failure Scenario** (0:30 - 1:30)
   - Click "Grid Failure" scenario card
   - Dramatic island mode alert banner appears
   - Grid node dims, battery takes over
   - Explain autonomous microgrid operation

3. **Parameter Manipulation** (1:30 - 2:30)
   - Slide Solar Intensity to 0%
   - Watch grid compensate in real-time
   - Observe merit order table update
   - Note cost impact in dispatch log

4. **Manual vs Smart Mode** (2:30 - 3:30)
   - Switch to Manual mode
   - Source control panel slides down
   - Toggle battery OFF
   - Show cost increase in log
   - Switch back to Smart — optimizer resumes

5. **Analysis Methods** (3:30 - 4:30)
   - Cycle through analysis toggles (Nodal → Thevenin → Max Power)
   - Show circuit math updating live in output panel
   - Switch to Circuit Analysis Lab tab
   - Demonstrate method-specific visualizations

6. **Advanced Features** (4:30 - 5:00)
   - Open Battery Intelligence tab
   - Show arbitrage savings counter
   - Switch to Grid Health tab
   - Demonstrate waveform analysis with harmonics
   - Close with help modal overview

## Browser Compatibility

- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+
- ✅ Opera 76+

Requires modern browser with ES6+ support and CSS Grid/Flexbox. No polyfills needed.

## Performance

- **Initial Load**: < 500ms (excluding CDN)
- **Chart.js**: Loaded from CDN (cached after first visit)
- **SVG Animations**: Hardware-accelerated via CSS transforms
- **Memory Footprint**: < 50MB typical
- **Update Frequency**: 3-second optimizer cycle, 1.5-second telemetry updates

Optimized for 1920×1080 fullscreen conference presentation mode with zero scrolling.

## Customization

### Changing Colors

Edit `css/variables.css` :root block:

```css
--bg-primary:       #0b1120   /* Main background */
--accent-gold:      #FFB830   /* Solar theme */
--accent-emerald:   #00E87A   /* Renewable theme */
--accent-teal:      #00E5CC   /* Primary accent */
```

### Adjusting Simulation Speed

Edit `js/main.js`:

```javascript
setInterval(runOptimizerStep, 3000); // Change 3000 to desired ms
```

### Adding New Scenarios

Edit `js/state.js` Scenarios object:

```javascript
MY_SCENARIO: {
  label: '🌟 My Custom Scenario',
  solar_pct: 50,
  battery_soc: 75,
  grid_price: 0.12,
  load_kw: 1800,
  sources: {solar:true, wind:true, battery:true, grid:true},
  accent: 'var(--accent-gold)',
  glow: 'var(--glow-gold)',
  grid_status: 'OPTIMAL',
  log: '🌟 Custom scenario loaded'
}
```

## License

MIT License - feel free to use this for educational, conference, or commercial demonstrations.

## Credits

Built with pure web technologies to demonstrate that stunning, production-quality engineering dashboards don't require heavy frameworks.

**Fonts**:
- Rajdhani (Google Fonts)
- Share Tech Mono (Google Fonts)
- DM Sans (Google Fonts)

**Visualization**:
- Chart.js 4.4.0 (MIT License)

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**GRIDMIND EMS** — Making smart grids smarter, one electron at a time. ⚡
