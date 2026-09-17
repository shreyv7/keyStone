# KEYSTONE GLOBAL DEVELOPMENT GUARDRAILS

These development guardrails are mandatory for all agents and contributors working in the Keystone codebase (`/home/harsh/keyStone`).
Whenever making small functional tweaks, UI updates, or refactors, strictly follow these rules to ensure existing functionality never breaks, styles remain consistent, and theme support is preserved.

---

## 1. Zero Naked CSS & Strict Styling Rules

> [!CAUTION]
> **NO NAKED CSS OR AD-HOC INLINE STYLES**  
> Never inject raw `<style>` tags, untokenized raw CSS classes, or inline `style={{ ... }}` for colors, backgrounds, borders, or typography.

### Permitted vs Forbidden Styling

| Forbidden Pattern (Will Break Code) | Permitted Standard Pattern |
| :--- | :--- |
| `style={{ color: '#ff3366', background: '#121212' }}` | Use Tailwind classes: `className={isLight ? 'text-red-700 bg-red-50' : 'text-red-400 bg-red-950/40'}` |
| Ad-hoc hex values: `bg-[#7928CA]`, `text-[#ff0055]` | Use project tokens or established dark oceanic palette (`#07090e`, `#0a0f1d`, `#2f2fe4`, slate neutrals) |
| Hardcoded dark-only classes without light mode support | Always pair with `isLight` condition or Tailwind `dark:` variant |
| Unscoped raw CSS in global files | Use modular utility classes defined in `src/index.css` (`ks-badge-*`, `ks-btn-*`, `ks-card`) |

### When is `style={{ ... }}` Allowed?
Inline styles are **ONLY** permitted for runtime-computed mathematical geometry:
- Dynamic percentage widths on progress/spread bars: `style={{ width: `${percent}%` }}`
- Dynamic SVG coordinate transforms or canvas offsets.
- 3D Three.js camera/canvas position parameters.

---

## 2. Strict Adherence to the Dark Oceanic Color Scheme

Keystone uses a refined **Dark Oceanic Aesthetic** paired with an enterprise-grade light mode. Do not deviate from this palette.

### Background Hierarchy
- **App Canvas Base**: `#07090e` (dark) / `#ffffff` (light)
- **Primary Panels & Cards**: `#0a0f1d` / `bg-slate-900/80` (dark) / `#ffffff` / `bg-slate-50` (light)
- **Deep Backdrops & Modals**: `#080616/95` (dark) / `#ffffff/95` (light)
- **Borders**: `border-slate-800` (dark) / `border-slate-200` (light)

### Brand & Primary Action Color
- **Electric Oceanic Blue**: `#2f2fe4` (hover: `#4343f8`), glow: `shadow-[0_0_15px_rgba(47,47,228,0.35)]`
- **Active Navigation**: `bg-[#2f2fe4] text-white`

### Strict 4-Color Semantic Tokens
Never use random colors for statuses. Every pill, badge, and indicator must use one of the 4 semantic tokens:

1. **Critical (Single points of failure, chokepoints, active exploits)**:
   - Dark: `bg-red-950/60 text-red-400 border-red-800/60`
   - Light: `bg-red-50 text-red-700 border-red-200`
   - Class helper: `ks-badge-critical`
2. **Warning (Anomalies, maintainer churn, unpinned transitive deps)**:
   - Dark: `bg-amber-950/60 text-amber-300 border-amber-800/60`
   - Light: `bg-amber-50 text-amber-800 border-amber-200`
   - Class helper: `ks-badge-warning`
3. **Info / Action (Navigation, primary actions, neutral metadata)**:
   - Dark: `bg-blue-950/60 text-blue-300 border-blue-800/60`
   - Light: `bg-blue-50 text-blue-700 border-blue-200`
   - Class helper: `ks-badge-info`
4. **Healthy / Safe (Zero breaking changes, verified contract, patched)**:
   - Dark: `bg-emerald-950/60 text-emerald-300 border-emerald-800/60`
   - Light: `bg-emerald-50 text-emerald-700 border-emerald-200`
   - Class helper: `ks-badge-healthy`

---

## 3. Functional Integrity Guardrails (Never Break Existing Flow)

Small functional tweaks must respect Keystone's state architecture.

### 1. Global View State & Routing
- `activeView` drives primary navigation: `'overview' | 'ecosystem' | 'watchlist' | 'mitigation' | 'cockpit' | 'scenarios' | 'connectors' | 'hardware' | 'organization' | 'settings' | 'apikeys' | 'profile'`.
- The default post-login landing view is **always** `'overview'` (`OverviewDashboard.tsx`). Do not change this back to dumping first-time users into the 3D graph without context.

### 2. Panel Exclusivity (No HUD Collisions)
- In `src/App.tsx`, `NodeIntelligencePanel` and `BlastRadiusHUD` must **never** render simultaneously on top of each other.
- When `simulationPhase === 'idle'`, `NodeIntelligencePanel` opens upon node selection.
- When `simulationPhase !== 'idle'` (`'simulating'` or `'active_compromise'`), `BlastRadiusHUD` has exclusive right-dock focus.

### 3. Simulation Lifecycle State Machine
Never bypass or corrupt the 4-phase simulation pipeline:
```
idle ➔ simulating ➔ active_compromise ➔ mitigation_applied
```
- `handleStartSimulation(nodeId)` triggers the camera transition and starts contagion spread.
- `handleComputeMitigation()` opens `MitigationPanel`.
- `handleApplyFix()` transitions the graph to `mitigation_applied` (green severed edges).

### 4. Role Lens Persistence
- The 3 lenses (`developer` / AppSec, `ciso` / Executive, `maintainer` / Engineering) alter perspectives and metrics across panels.
- Do not remove lens handlers. A change to copy in one lens must not crash or drop the other two lenses.

---

## 4. Human-First Copy & Progressive Disclosure (The 10-Second Test)

Every screen must pass the **10-Second Hackathon Judge Test**: any technical judge or executive must grasp *what is wrong* and *what fix to apply* in under 10 seconds.

### Terminology Rules
- **No Internal Feature Codes**: Never display `F1`, `F2`, `F4`, `F6`, `F7`, `F10`, `F11`, `F14`, `F15`, `F17`, `F18`, `F21` in user-facing buttons, badges, or headers.
- **No Academic Math Jargon in Primary UI**:
  - ❌ `Compute Minimum Cut` $\to$ ✅ **"Plan Targeted Fix (1 Coordinated PR)"**
  - ❌ `Apply Architectural Cut` $\to$ ✅ **"Apply Targeted Fix"**
  - ❌ `Cut-Vertex` $\to$ ✅ **"Critical Chokepoint"**
  - ❌ `Tier-1 Sinks` $\to$ ✅ **"Critical Services"**
  - ❌ `Freeze CI/CD Intake (Circuit Breaker)` $\to$ ✅ **"Quarantine Dependency"**
  - ❌ `SC=0.35` $\to$ ✅ **"Normal"** (exact score in tooltip)
  - ❌ `Anti-TOCTOU Cryptographic Lock` $\to$ ✅ **"Cryptographic Integrity Lock"**

### Progressive Disclosure Rule
Deep technical proof is Keystone's greatest strength, but it must be structured hierarchically:
1. **Primary Surface**: High-level verdict in plain English (`100% API Compatible — 0 breaking changes`, `Removes CVE-2022-1471`).
2. **Secondary Surface**: Impact scope (`21 dependent services`, `4 critical services protected`).
3. **Advanced Technical Details Accordion**: Full AST call-site proofs, JVM opcode matches (`42 INVOKEVIRTUAL verified`), and JSON attribution receipts belong inside `<details className="group ...">` accordions.

---

## 5. Verification & Atomic Commits

Before concluding any code modification:
1. **Build Verification**: Run `npm run build`. The build must succeed with 0 TypeScript or bundling errors.
2. **Theme Verification**: Verify changes render correctly in both Dark Mode (`bg-[#07090e]`) and Light Mode (`isLight`).
3. **Atomic Scope**: Keep changes focused on the target component; do not introduce unintended side effects across unrelated views.
