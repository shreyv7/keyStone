# KEYSTONE — Project Startup Guide

> **Official reference guide to install, configure, start, and run the KEYSTONE application.**  
> Always refer to this document whenever starting or restarting the project.

---

## ⚡ Quick Start (TL;DR)

From this directory (`keyStone/`), run:

```bash
# 1. Install dependencies (if first time or after pulling changes)
npm install

# 2. (Optional) Configure environment variables
cp .env.example .env

# 3. Start the development server
npm run dev
```

Once running, access the application in your browser at:
👉 **[http://localhost:3000](http://localhost:3000)** (or `http://127.0.0.1:3000`)

---

## 📋 Prerequisites

Ensure your development machine has the following tools installed:

| Requirement | Minimum Version | Recommended / Tested | Verification Command |
|---|---|---|---|
| **Node.js** | `>= 18.0.0` | `v20.x` or `v25.x` | `node -v` |
| **npm** | `>= 9.0.0` | `10.x` or `11.x` | `npm -v` |
| **Web Browser** | Modern Evergreen | Chrome / Brave / Edge / Safari / Firefox | WebGL & Hardware Acceleration enabled |

> [!NOTE]
> KEYSTONE features high-performance 3D WebGL dependency graphs powered by **Three.js**. For the best visual experience, ensure hardware acceleration is enabled in your browser settings.

---

## 🛠️ Detailed Setup Instructions

### 1. Repository Structure Overview

```text
.
├── src/                    # UI Components, State, 3D Graph, Mock Data
│   ├── components/         # Modular UI views, dashboards, and HUDs
│   ├── context/            # Global context (Theme, etc.)
│   ├── data/               # Mock ecosystem, topology, CVE intelligence
│   └── utils/              # Export utilities, graph math, formatting
├── public/                 # Static assets, demo media, images
├── .env.example            # Sample environment variables
├── package.json            # Scripts & dependencies
├── vite.config.ts          # Vite configuration with Tailwind CSS v4
└── startup.md              # This guide
```

### 2. Configure Environment Variables

The project includes pre-configured defaults, but if you wish to enable live AI-assisted intelligence:

```bash
cp .env.example .env
```

Open `.env` in your editor and configure:

```ini
# GEMINI_API_KEY: Optional. Enables live LLM queries in the "Ask Keystone" natural-language assistant
GEMINI_API_KEY="your-gemini-api-key-here"

# APP_URL: Base URL where the app is hosted (default: http://localhost:3000)
APP_URL="http://localhost:3000"
```

> [!TIP]
> The app is fully interactive out of the box with offline mock intelligence and synthetic graph simulation if no API key is provided.

### 3. Install Dependencies

```bash
npm install
```

*(Optional: If using Bun, you can also run `bun install`)*

### 4. Launch Development Server

```bash
npm run dev
```

The Vite dev server will start with host binding `0.0.0.0` and port `3000`:
- **Local:** `http://localhost:3000/`
- **Network:** `http://<your-local-ip>:3000/`

---

## 📜 Available Scripts

| Command | Action | Description |
|---|---|---|
| `npm run dev` | `vite --port=3000 --host=0.0.0.0` | Starts the local dev server with HMR on port 3000 |
| `npm run build` | `vite build` | Compiles production TypeScript bundle into `dist/` |
| `npm run preview` | `vite preview` | Locally serves the production build from `dist/` |
| `npm run lint` | `tsc --noEmit` | Runs strict TypeScript type-checking without emitting files |
| `npm run clean` | `rm -rf dist server.js` | Removes cached build artifacts |

---

## 🧭 Platform Views & Navigation Guide

When the application loads, you can access the following modules via the Top Navigation and Sidebar:

- **Landing Page** (`landing`): Product presentation, key value proposition, high-level metrics, and direct entry CTA.
- **3D Topology Map** (`ecosystem`): Interactive 3D WebGL dependency graph with force layout, cluster grouping, and node inspection.
- **Security Posture** (`overview`): Executive security dashboard, portfolio health, centrality metrics, and alert trends.
- **Risk Watchlist** (`watchlist`): Critical packages, vulnerability severity scores, exploitability metrics, and triage actions.
- **Attack Scenarios** (`scenarios`): Blast radius simulation, compromise propagation animation, and step-by-step attack vectors.
- **Remediation & Mitigation** (`mitigation`): Minimum-cut algorithm recommendations, coordinated multi-repo PR generator, and fix validation.
- **Hardware Supply Chain** (`hardware`): Firmware, ASIC, and component-level dependency tracking.
- **Connectors & Integrations** (`connectors`): Enterprise repository connections (GitHub, GitLab, Artifactory, Snyk, SonarQube).
- **Organization & Settings** (`organization`, `settings`, `api-keys`, `profile`): Org settings, API key manager, and security policies.

---

## ❓ Troubleshooting & FAQs

### Port 3000 is already in use
If another application is running on port 3000, specify a different port:
```bash
npm run dev -- --port 3001
```

### Type Checking or Build Issues
Verify that all TypeScript types compile without errors:
```bash
npm run lint
```

### Vite Cache Reset
If styles or modules appear stale:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Three.js / WebGL not rendering properly
1. Check that hardware acceleration is enabled:
   - In Google Chrome: `Settings` > `System` > `Use graphics acceleration when available` (Toggle ON).
2. Ensure your browser supports WebGL 2.0 by visiting [get.webgl.org](https://get.webgl.org/).

---

## 🔒 Security & Code Hygiene

- Never commit real API keys or sensitive secrets into `.env`.
- Ensure `.gitignore` ignores `.env`, `dist/`, and `node_modules/`.
- Run `npm run lint` before committing changes to maintain strict type safety.
