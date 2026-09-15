import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  GitPullRequest,
  ArrowRight,
  ExternalLink,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
  Network
} from "lucide-react";

interface HeroTopologyShowcaseProps {
  onEnterConsole: () => void;
  onLaunchScenario?: (scenarioId: string) => void;
}

type SimulationMode = "normal" | "cascade" | "mincut";

interface NodeData {
  id: string;
  name: string;
  version: string;
  layer: "OSS Foundational" | "Shared Pipeline" | "Tier-1 Core Asset";
  score: number;
  conventionalScore: number;
  status: "nominal" | "keystone" | "compromised" | "insulated" | "remedy";
  category: string;
  centrality: string;
  centralityPts: number;
  fragility: string;
  fragilityPts: number;
  reach: string;
  reachPts: number;
  exploit: string;
  exploitPts: number;
  description: string;
}

const NODES: Record<string, NodeData> = {
  snakeyaml: {
    id: "snakeyaml",
    name: "snakeyaml",
    version: "1.33",
    layer: "OSS Foundational",
    score: 88,
    conventionalScore: 48,
    status: "keystone",
    category: "Structural Articulation Point",
    centrality: "Top 0.5% betweenness paths",
    centralityPts: 38,
    fragility: "1 unfunded maintainer (Bus Factor 1)",
    fragilityPts: 22,
    reach: "Direct choke to 3/3 Core Assets",
    reachPts: 20,
    exploit: "RCE deserialization (CVE-2022-1471)",
    exploitPts: 8,
    description: "Load-bearing articulation cut-vertex. Compromising this single package cascades across 21 production microservices simultaneously."
  },
  minimist: {
    id: "minimist",
    name: "minimist",
    version: "0.0.8",
    layer: "OSS Foundational",
    score: 84,
    conventionalScore: 52,
    status: "keystone",
    category: "Runtime Prototype Vector",
    centrality: "Top 1.2% betweenness paths",
    centralityPts: 36,
    fragility: "48M downloads / 1 author (Bus Factor 1)",
    fragilityPts: 24,
    reach: "Direct path to API & Session Stores",
    reachPts: 16,
    exploit: "Prototype pollution (CVE-2020-7598)",
    exploitPts: 8,
    description: "Foundational CLI parser widely embedded deep in transitive trees. Unsanitized parameter mutations pollute global execution contexts."
  },
  commonstext: {
    id: "commonstext",
    name: "commons-text",
    version: "1.9",
    layer: "OSS Foundational",
    score: 76,
    conventionalScore: 65,
    status: "nominal",
    category: "Interpolation Parser",
    centrality: "Top 4.5% graph centrality",
    centralityPts: 26,
    fragility: "Apache Foundation maintainer team",
    fragilityPts: 10,
    reach: "Feeds downstream auth tokens",
    reachPts: 22,
    exploit: "Variable interpolation script lookup",
    exploitPts: 18,
    description: "Dynamic string evaluation engine. While maintained by a foundation, its reach into authentication tokens creates systemic blast potential."
  },
  datapipeline: {
    id: "datapipeline",
    name: "internal-data-pipeline",
    version: "2.5.0",
    layer: "Shared Pipeline",
    score: 62,
    conventionalScore: 20,
    status: "remedy",
    category: "Min-Cut Surgical Dominator",
    centrality: "Bottleneck node for enterprise DAG",
    centralityPts: 42,
    fragility: "Internal Platform Team (High oversight)",
    fragilityPts: 4,
    reach: "Passes 100% of telemetry to Tier-1",
    reachPts: 14,
    exploit: "Pass-through transitive dependency",
    exploitPts: 2,
    description: "The architectural bridge. Upgrading this single internal dependency to v2.5.1 completely severs upstream contagion from reaching payment sinks."
  },
  authtokens: {
    id: "authtokens",
    name: "auth-tokens-core",
    version: "1.4.2",
    layer: "Shared Pipeline",
    score: 58,
    conventionalScore: 18,
    status: "nominal",
    category: "Security Token Gateway",
    centrality: "Cryptographic verification layer",
    centralityPts: 28,
    fragility: "Dedicated IAM engineering team",
    fragilityPts: 6,
    reach: "Feeds IAM identity endpoints",
    reachPts: 20,
    exploit: "Strict type-checking enforced",
    exploitPts: 4,
    description: "Core authentication library handling JWT signing and verification. Hardened interfaces mitigate direct prototype injections."
  },
  payment: {
    id: "payment",
    name: "Payment-Gateway",
    version: "Tier-1",
    layer: "Tier-1 Core Asset",
    score: 95,
    conventionalScore: 0,
    status: "nominal",
    category: "Crown Jewel Transaction Sink",
    centrality: "Handles $42M / Day transaction flow",
    centralityPts: 45,
    fragility: "Zero direct OSS packages allowed",
    fragilityPts: 5,
    reach: "Production PCI-DSS scoped enclave",
    reachPts: 40,
    exploit: "Target of financial exfiltration",
    exploitPts: 5,
    description: "Primary payment processing cluster. Although heavily audited, transitive dependencies in data ingestion pipelines expose it to indirect compromise."
  },
  authiam: {
    id: "authiam",
    name: "Auth-IAM-Service",
    version: "Tier-1",
    layer: "Tier-1 Core Asset",
    score: 92,
    conventionalScore: 0,
    status: "nominal",
    category: "Zero-Trust Identity Core",
    centrality: "Manages session state for 4.2M users",
    centralityPts: 42,
    fragility: "High redundancy infrastructure",
    fragilityPts: 6,
    reach: "Grants administrative access scopes",
    reachPts: 38,
    exploit: "Credential forging target",
    exploitPts: 6,
    description: "Centralized identity provider. A compromised upstream deserializer would grant attackers arbitrary token forgery and persistence."
  },
  billing: {
    id: "billing",
    name: "Billing-Analytics",
    version: "Tier-1",
    layer: "Tier-1 Core Asset",
    score: 82,
    conventionalScore: 0,
    status: "nominal",
    category: "Financial Ledger Sink",
    centrality: "Processes $15M / Day revenue logs",
    centralityPts: 34,
    fragility: "Standard internal SLA",
    fragilityPts: 8,
    reach: "Direct database write privileges",
    reachPts: 32,
    exploit: "Data tampering potential",
    exploitPts: 8,
    description: "Real-time billing aggregation pipeline. Ingests data through shared serialization utilities, creating a secondary systemic target."
  }
};

export const HeroTopologyShowcase: React.FC<HeroTopologyShowcaseProps> = ({
  onEnterConsole,
  onLaunchScenario
}) => {
  const [mode, setMode] = useState<SimulationMode>("normal");
  const [selectedId, setSelectedId] = useState<string>("snakeyaml");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedNode = NODES[selectedId] || NODES.snakeyaml;

  return (
    <div className="w-full max-w-6xl rounded-2xl border border-slate-200 shadow-2xl bg-white overflow-hidden text-left" id="product">
      {/* Sleek Enterprise Titlebar */}
      <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
          </div>
          <div className="ml-2 flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200 shadow-2xs font-mono text-[11px] text-slate-600">
            <Lock className="w-3 h-3 text-emerald-600" />
            <span className="font-semibold text-slate-800">console.keystone.internal</span>
            <span className="text-slate-400">/topology/production-core</span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold">DAG SYNC: 42 REPOS</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-slate-400">
            <span>LATENCY:</span>
            <span className="text-slate-700 font-semibold">14.2ms</span>
          </div>
          <button
            onClick={onEnterConsole}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold font-sans cursor-pointer transition-colors"
          >
            <span>Launch Console</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

        {/* Left Interactive Canvas & Simulation Playground */}
        <div className="lg:col-span-8 p-5 sm:p-6 bg-slate-50/50 flex flex-col justify-between relative overflow-hidden">

          {/* Top Canvas Bar with Interactive Mode Tabs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-base font-bold text-slate-900">
                    Live Multi-Repo Topology Graph
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-blue-100 text-blue-800">
                    INTERACTIVE
                  </span>
                </div>
                <p className="font-body text-xs text-slate-500 mt-0.5">
                  Click any node to inspect its deterministic waterfall score and cascade vulnerability.
                </p>
              </div>

              {/* Simulation Mode Switcher */}
              <div className="inline-flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/80 font-heading text-xs self-start sm:self-auto">
                <button
                  onClick={() => setMode("normal")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${mode === "normal"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  <Network className="w-3.5 h-3.5 text-blue-600" />
                  <span>Normal</span>
                </button>

                <button
                  onClick={() => {
                    setMode("cascade");
                    setSelectedId("snakeyaml");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${mode === "cascade"
                      ? "bg-red-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-red-700"
                    }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Simulate Cascade</span>
                </button>

                <button
                  onClick={() => {
                    setMode("mincut");
                    setSelectedId("datapipeline");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${mode === "mincut"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-emerald-700"
                    }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Apply Min-Cut</span>
                </button>
              </div>
            </div>

            {/* Simulated Dynamic Status Banner */}
            {mode === "cascade" && (
              <div className="mb-3 px-3.5 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  <span className="font-bold font-heading">SIMULATION ACTIVE:</span>
                  <span>Compromise in <strong>snakeyaml@1.33</strong> propagating along unshielded paths to Payment Gateway ($85M/Day).</span>
                </div>
                <button
                  onClick={() => setMode("mincut")}
                  className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold font-heading text-[11px] cursor-pointer shadow-xs shrink-0 ml-2"
                >
                  Deploy Min-Cut Fix
                </button>
              </div>
            )}

            {mode === "mincut" && (
              <div className="mb-3 px-3.5 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold font-heading">MIN-CUT APPLIED:</span>
                  <span>Upgraded <strong>internal-data-pipeline</strong> to <strong>v2.5.1</strong>. 100% contagion paths severed in 1 PR.</span>
                </div>
                <button
                  onClick={() => setMode("normal")}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 font-bold font-heading text-[11px] cursor-pointer shadow-2xs shrink-0 ml-2"
                >
                  Reset Topology
                </button>
              </div>
            )}

            {/* Interactive SVG Graph Playground */}
            <div className="w-full rounded-xl border border-slate-200 bg-white relative overflow-hidden shadow-inner p-2">

              {/* Subtle Background Cyber Grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40"
                style={{
                  backgroundImage: "radial-gradient(#94a3b8 0.75px, transparent 0.75px)",
                  backgroundSize: "16px 16px"
                }}
              />

              {/* Layer Columns Guide Header */}
              <div className="relative z-10 grid grid-cols-3 px-4 pt-2 pb-1 border-b border-slate-100 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                <div className="text-left">Layer 1: Foundational OSS</div>
                <div className="text-center">Layer 2: Shared Bridges</div>
                <div className="text-right">Layer 3: Production Sinks</div>
              </div>

              {/* SVG Graphic Canvas */}
              <svg
                viewBox="0 0 740 370"
                className="w-full h-auto select-none relative z-10"
                style={{ minHeight: "310px" }}
              >
                <defs>
                  {/* Glowing Filter Definitions */}
                  <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Gradient Lines */}
                  <linearGradient id="edge-snake-data" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={mode === "cascade" ? "#ef4444" : "#94a3b8"} />
                    <stop offset="100%" stopColor={mode === "cascade" ? "#dc2626" : mode === "mincut" ? "#10b981" : "#64748b"} />
                  </linearGradient>
                </defs>

                {/* --- DEPENDENCY EDGES --- */}
                {/* 1. snakeyaml -> internal-data-pipeline */}
                <path
                  d="M 175 75 C 235 75, 235 125, 290 125"
                  fill="none"
                  stroke={mode === "mincut" ? "#ef4444" : mode === "cascade" ? "#ef4444" : "#cbd5e1"}
                  strokeWidth={mode === "cascade" ? "3" : "2"}
                  strokeDasharray={mode === "mincut" ? "5 4" : "none"}
                  filter={mode === "cascade" ? "url(#glow-red)" : undefined}
                  className="transition-all duration-300"
                />

                {/* 2. minimist -> internal-data-pipeline */}
                <path
                  d="M 175 185 C 235 185, 235 125, 290 125"
                  fill="none"
                  stroke={mode === "cascade" ? "#f97316" : "#cbd5e1"}
                  strokeWidth={mode === "cascade" ? "2.5" : "2"}
                  className="transition-all duration-300"
                />

                {/* 3. commons-text -> auth-tokens-core */}
                <path
                  d="M 175 295 C 235 295, 235 245, 290 245"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* 4. internal-data-pipeline -> Payment-Gateway */}
                <path
                  d="M 465 125 C 515 125, 515 70, 565 70"
                  fill="none"
                  stroke={mode === "mincut" ? "#10b981" : mode === "cascade" ? "#ef4444" : "#cbd5e1"}
                  strokeWidth={mode === "cascade" || mode === "mincut" ? "3" : "2"}
                  filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  className="transition-all duration-300"
                />

                {/* 5. internal-data-pipeline -> Auth-IAM-Service */}
                <path
                  d="M 465 125 C 515 125, 515 180, 565 180"
                  fill="none"
                  stroke={mode === "mincut" ? "#10b981" : mode === "cascade" ? "#ef4444" : "#cbd5e1"}
                  strokeWidth={mode === "cascade" || mode === "mincut" ? "3" : "2"}
                  filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  className="transition-all duration-300"
                />

                {/* 6. internal-data-pipeline -> Billing-Analytics */}
                <path
                  d="M 465 125 C 515 125, 515 290, 565 290"
                  fill="none"
                  stroke={mode === "mincut" ? "#10b981" : mode === "cascade" ? "#ef4444" : "#cbd5e1"}
                  strokeWidth={mode === "cascade" || mode === "mincut" ? "2.5" : "2"}
                  filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  className="transition-all duration-300"
                />

                {/* 7. auth-tokens-core -> Auth-IAM-Service */}
                <path
                  d="M 465 245 C 515 245, 515 180, 565 180"
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  className="transition-all duration-300"
                />

                {/* Flow Particles for Active Mode */}
                {mode === "cascade" && (
                  <>
                    <circle r="4" fill="#ef4444" filter="url(#glow-red)">
                      <animateMotion
                        path="M 175 75 C 235 75, 235 125, 290 125"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#ef4444" filter="url(#glow-red)">
                      <animateMotion
                        path="M 465 125 C 515 125, 515 70, 565 70"
                        dur="1.2s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#ef4444" filter="url(#glow-red)">
                      <animateMotion
                        path="M 465 125 C 515 125, 515 180, 565 180"
                        dur="1.2s"
                        begin="0.6s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {mode === "mincut" && (
                  <>
                    <circle r="4" fill="#10b981" filter="url(#glow-green)">
                      <animateMotion
                        path="M 465 125 C 515 125, 515 70, 565 70"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="4" fill="#10b981" filter="url(#glow-green)">
                      <animateMotion
                        path="M 465 125 C 515 125, 515 180, 565 180"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </>
                )}

                {/* Min-Cut Severed Scissors Icon Indicator */}
                {mode === "mincut" && (
                  <g transform="translate(225, 93)">
                    <circle r="13" fill="#ffffff" stroke="#ef4444" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#ef4444">✂</text>
                    <rect x="-34" y="16" width="68" height="16" rx="4" fill="#ef4444" />
                    <text x="0" y="28" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff" fontFamily="monospace">
                      PR #142 CUT
                    </text>
                  </g>
                )}

                {/* --- GRAPH NODES --- */}

                {/* Node: snakeyaml@1.33 */}
                <g
                  onClick={() => setSelectedId("snakeyaml")}
                  onMouseEnter={() => setHoveredId("snakeyaml")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer transition-transform"
                >
                  <rect
                    x="25"
                    y="48"
                    width="150"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "snakeyaml" ? "#ef4444" : mode === "cascade" ? "#ef4444" : "#e2e8f0"}
                    strokeWidth={selectedId === "snakeyaml" ? "2.5" : "1.5"}
                    filter={selectedId === "snakeyaml" || mode === "cascade" ? "url(#glow-red)" : undefined}
                  />
                  <circle cx="45" cy="75" r="5" fill="#ef4444" className={mode === "cascade" ? "animate-ping" : ""} />
                  <circle cx="45" cy="75" r="4" fill="#ef4444" />
                  <text x="60" y="70" fontSize="12" fontWeight="bold" fill="#0f172a" fontFamily="monospace">snakeyaml</text>
                  <text x="60" y="86" fontSize="10" fill="#64748b" fontFamily="monospace">@1.33 · Score 88</text>
                  <rect x="128" y="55" width="40" height="14" rx="3" fill="#fee2e2" />
                  <text x="148" y="65" fontSize="8" fontWeight="bold" fill="#b91c1c" textAnchor="middle">KEYSTONE</text>
                </g>

                {/* Node: minimist@0.0.8 */}
                <g
                  onClick={() => setSelectedId("minimist")}
                  onMouseEnter={() => setHoveredId("minimist")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="25"
                    y="158"
                    width="150"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "minimist" ? "#f97316" : "#e2e8f0"}
                    strokeWidth={selectedId === "minimist" ? "2.5" : "1.5"}
                  />
                  <circle cx="45" cy="185" r="4" fill="#f97316" />
                  <text x="60" y="180" fontSize="12" fontWeight="bold" fill="#0f172a" fontFamily="monospace">minimist</text>
                  <text x="60" y="196" fontSize="10" fill="#64748b" fontFamily="monospace">@0.0.8 · Score 84</text>
                  <rect x="124" y="165" width="44" height="14" rx="3" fill="#ffedd5" />
                  <text x="146" y="175" fontSize="8" fontWeight="bold" fill="#c2410c" textAnchor="middle">POLLUTION</text>
                </g>

                {/* Node: commons-text@1.9 */}
                <g
                  onClick={() => setSelectedId("commonstext")}
                  onMouseEnter={() => setHoveredId("commonstext")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="25"
                    y="268"
                    width="150"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "commonstext" ? "#3b82f6" : "#e2e8f0"}
                    strokeWidth={selectedId === "commonstext" ? "2.5" : "1.5"}
                  />
                  <circle cx="45" cy="295" r="4" fill="#3b82f6" />
                  <text x="60" y="290" fontSize="12" fontWeight="bold" fill="#0f172a" fontFamily="monospace">commons-text</text>
                  <text x="60" y="306" fontSize="10" fill="#64748b" fontFamily="monospace">@1.9 · Score 76</text>
                  <rect x="128" y="275" width="40" height="14" rx="3" fill="#dbeafe" />
                  <text x="148" y="285" fontSize="8" fontWeight="bold" fill="#1d4ed8" textAnchor="middle">PARSER</text>
                </g>

                {/* Node: internal-data-pipeline (The Min-Cut Keystone Bridge!) */}
                <g
                  onClick={() => setSelectedId("datapipeline")}
                  onMouseEnter={() => setHoveredId("datapipeline")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="290"
                    y="95"
                    width="175"
                    height="60"
                    rx="12"
                    fill="#ffffff"
                    stroke={selectedId === "datapipeline" ? "#10b981" : mode === "mincut" ? "#10b981" : "#2563eb"}
                    strokeWidth={selectedId === "datapipeline" || mode === "mincut" ? "2.5" : "2"}
                    filter={mode === "mincut" ? "url(#glow-green)" : undefined}
                  />
                  <circle cx="312" cy="125" r="5" fill={mode === "mincut" ? "#10b981" : "#2563eb"} />
                  <text x="326" y="118" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="monospace">internal-data-pipeline</text>
                  <text x="326" y="133" fontSize="10" fill="#64748b" fontFamily="monospace">
                    {mode === "mincut" ? "v2.5.1 (PATCHED)" : "v2.5.0 (BRIDGE)"}
                  </text>
                  <rect x="298" y="137" width="94" height="13" rx="3" fill={mode === "mincut" ? "#d1fae5" : "#eff6ff"} />
                  <text x="345" y="146" fontSize="7.5" fontWeight="bold" fill={mode === "mincut" ? "#047857" : "#1d4ed8"} textAnchor="middle">
                    {mode === "mincut" ? "✓ 1 PR MIN-CUT" : "★ MIN-CUT CHOKEPOINT"}
                  </text>
                </g>

                {/* Node: auth-tokens-core */}
                <g
                  onClick={() => setSelectedId("authtokens")}
                  onMouseEnter={() => setHoveredId("authtokens")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="290"
                    y="218"
                    width="175"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "authtokens" ? "#3b82f6" : "#e2e8f0"}
                    strokeWidth={selectedId === "authtokens" ? "2.5" : "1.5"}
                  />
                  <circle cx="312" cy="245" r="4" fill="#64748b" />
                  <text x="326" y="240" fontSize="11" fontWeight="bold" fill="#0f172a" fontFamily="monospace">auth-tokens-core</text>
                  <text x="326" y="256" fontSize="10" fill="#64748b" fontFamily="monospace">v1.4.2 · Auth Gateway</text>
                </g>

                {/* Node: Payment-Gateway */}
                <g
                  onClick={() => setSelectedId("payment")}
                  onMouseEnter={() => setHoveredId("payment")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="565"
                    y="43"
                    width="155"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "payment" ? "#2563eb" : mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#e2e8f0"}
                    strokeWidth={selectedId === "payment" ? "2.5" : "1.5"}
                    filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  />
                  <circle cx="585" cy="70" r="5" fill={mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#2563eb"} />
                  <text x="598" y="65" fontSize="11" fontWeight="bold" fill="#0f172a">Payment-Gateway</text>
                  <text x="598" y="80" fontSize="10" fontWeight="bold" fill={mode === "cascade" ? "#dc2626" : mode === "mincut" ? "#059669" : "#2563eb"}>
                    {mode === "cascade" ? "EXPOSED ($42M)" : mode === "mincut" ? "INSULATED ($0)" : "$42M/Day Vol"}
                  </text>
                  <rect x="665" y="50" width="48" height="14" rx="3" fill="#f1f5f9" />
                  <text x="689" y="60" fontSize="8" fontWeight="bold" fill="#475569" textAnchor="middle">TIER-1</text>
                </g>

                {/* Node: Auth-IAM-Service */}
                <g
                  onClick={() => setSelectedId("authiam")}
                  onMouseEnter={() => setHoveredId("authiam")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="565"
                    y="153"
                    width="155"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "authiam" ? "#2563eb" : mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#e2e8f0"}
                    strokeWidth={selectedId === "authiam" ? "2.5" : "1.5"}
                    filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  />
                  <circle cx="585" cy="180" r="5" fill={mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#2563eb"} />
                  <text x="598" y="175" fontSize="11" fontWeight="bold" fill="#0f172a">Auth-IAM-Service</text>
                  <text x="598" y="190" fontSize="10" fontWeight="bold" fill={mode === "cascade" ? "#dc2626" : mode === "mincut" ? "#059669" : "#2563eb"}>
                    {mode === "cascade" ? "EXPOSED ($28M)" : mode === "mincut" ? "INSULATED ($0)" : "$28M/Day Vol"}
                  </text>
                  <rect x="665" y="160" width="48" height="14" rx="3" fill="#f1f5f9" />
                  <text x="689" y="170" fontSize="8" fontWeight="bold" fill="#475569" textAnchor="middle">TIER-1</text>
                </g>

                {/* Node: Billing-Analytics */}
                <g
                  onClick={() => setSelectedId("billing")}
                  onMouseEnter={() => setHoveredId("billing")}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                >
                  <rect
                    x="565"
                    y="263"
                    width="155"
                    height="54"
                    rx="10"
                    fill="#ffffff"
                    stroke={selectedId === "billing" ? "#2563eb" : mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#e2e8f0"}
                    strokeWidth={selectedId === "billing" ? "2.5" : "1.5"}
                    filter={mode === "cascade" ? "url(#glow-red)" : mode === "mincut" ? "url(#glow-green)" : undefined}
                  />
                  <circle cx="585" cy="290" r="5" fill={mode === "cascade" ? "#ef4444" : mode === "mincut" ? "#10b981" : "#2563eb"} />
                  <text x="598" y="285" fontSize="11" fontWeight="bold" fill="#0f172a">Billing-Analytics</text>
                  <text x="598" y="300" fontSize="10" fontWeight="bold" fill={mode === "cascade" ? "#dc2626" : mode === "mincut" ? "#059669" : "#2563eb"}>
                    {mode === "cascade" ? "EXPOSED ($15M)" : mode === "mincut" ? "INSULATED ($0)" : "$15M/Day Vol"}
                  </text>
                  <rect x="665" y="270" width="48" height="14" rx="3" fill="#f1f5f9" />
                  <text x="689" y="280" fontSize="8" fontWeight="bold" fill="#475569" textAnchor="middle">TIER-1</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Bottom Dynamic Telemetry Bar */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 font-body">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Articulation Points</div>
              <div className="font-heading text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${mode === "mincut" ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`}></span>
                <span>{mode === "mincut" ? "0 Reachable" : "1 Critical (snakeyaml)"}</span>
              </div>
              <div className="text-[10px] text-slate-500">
                {mode === "mincut" ? "Fully insulated by Min-Cut" : "Reaches 3/3 Core Assets"}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Min-Cut Intervention</div>
              <div className="font-heading text-lg font-bold text-emerald-600 mt-0.5">
                {mode === "mincut" ? "PR #142 Merged" : "internal-data-pipeline"}
              </div>
              <div className="text-[10px] text-emerald-700">
                {mode === "mincut" ? "1 Single PR severing 100% blast" : "Surgical cut target"}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-left shadow-2xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Daily Asset Exposure</div>
              <div className={`font-heading text-lg font-bold mt-0.5 ${mode === "mincut" ? "text-emerald-600" : mode === "cascade" ? "text-red-600 animate-pulse" : "text-blue-600"
                }`}>
                {mode === "mincut" ? "$0 Exposure" : "$85,000,000"}
              </div>
              <div className="text-[10px] text-slate-500">
                {mode === "mincut" ? "100% Assets Protected" : "Tier-1 Payment & Auth Sinks"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Triage & Factor Attribution Inspector */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-white flex flex-col justify-between">
          <div>
            {/* Active Inspected Node Titlebar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedNode.score >= 80 ? "bg-red-500" : selectedNode.score >= 60 ? "bg-amber-500" : "bg-blue-500"
                  }`}></span>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-950">
                    {selectedNode.name}@{selectedNode.version}
                  </div>
                  <div className="text-[10px] font-sans text-slate-500">{selectedNode.layer}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${selectedNode.score >= 80 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}>
                  SCORE: {selectedNode.score} / 100
                </span>
                {selectedNode.conventionalScore > 0 && (
                  <span className="text-[9px] text-slate-400 mt-0.5">
                    CVSS: {selectedNode.conventionalScore}/100
                  </span>
                )}
              </div>
            </div>

            {/* Title & Attribution Subtext */}
            <div className="mb-4">
              <div className="font-heading text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Deterministic Waterfall Receipt</span>
              </div>
              <p className="font-body text-[11px] text-slate-500 mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            {/* Score Breakdown Table */}
            <div className="space-y-2 text-xs font-mono mb-4">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center hover:bg-slate-100/80 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">[+] Network Centrality</div>
                  <div className="text-[10px] text-slate-500 font-sans">{selectedNode.centrality}</div>
                </div>
                <span className="font-bold text-blue-600">+{selectedNode.centralityPts} pts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center hover:bg-slate-100/80 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">[+] Maintainer Fragility</div>
                  <div className="text-[10px] text-slate-500 font-sans">{selectedNode.fragility}</div>
                </div>
                <span className="font-bold text-amber-600">+{selectedNode.fragilityPts} pts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center hover:bg-slate-100/80 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">[+] Downstream Reach</div>
                  <div className="text-[10px] text-slate-500 font-sans">{selectedNode.reach}</div>
                </div>
                <span className="font-bold text-red-600">+{selectedNode.reachPts} pts</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center hover:bg-slate-100/80 transition-colors">
                <div>
                  <div className="font-bold text-slate-800">[+] Exploit Signal</div>
                  <div className="text-[10px] text-slate-500 font-sans">{selectedNode.exploit}</div>
                </div>
                <span className="font-bold text-purple-600">+{selectedNode.exploitPts} pts</span>
              </div>
            </div>

            {/* Actionable PR Card when Min-Cut is active */}
            {mode === "mincut" ? (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-mono space-y-1">
                <div className="font-bold font-heading text-emerald-800 flex items-center gap-1.5 text-[11px]">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>COORDINATED PR DIRECTIVE READY</span>
                </div>
                <div className="text-[10px] text-emerald-700">Target: internal-data-pipeline:2.5.0 → 2.5.1</div>
                <div className="text-[10px] text-emerald-700 font-semibold">Net Security Gain: +4 (Zero Breaking Changes)</div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Computed live across 42 CycloneDX & SPDX software bill-of-materials.</span>
              </div>
            )}
          </div>

          {/* Remediation Action Button */}
          <div className="mt-5 pt-3.5 border-t border-slate-200">
            <button
              onClick={() => {
                if (onLaunchScenario && selectedNode.id === "snakeyaml") {
                  onLaunchScenario("snakeyaml_hero");
                } else {
                  onEnterConsole();
                }
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {selectedNode.id === "datapipeline"
                  ? "Deploy Min-Cut Fix in Console"
                  : selectedNode.id === "snakeyaml"
                    ? "Test SnakeYAML Remediation"
                    : "Inspect Node in Live Console"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
