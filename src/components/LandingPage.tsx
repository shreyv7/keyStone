import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Network,
  Activity,
  ArrowRight,
  Sparkles,
  Lock,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Layers,
  BarChart3,
  PlayCircle,
  Play,
  Server,
  FileCode2,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Terminal,
  Filter,
  Check,
  GitMerge,
  Radar,
  HelpCircle,
  Copy,
  ChevronUp,
  AlertTriangle,
  FileSpreadsheet,
  Code2
} from "lucide-react";
import { KeystoneStats } from "../types";
import { HeroTopologyShowcase } from "./HeroTopologyShowcase";
import { InteractiveTopologyCanvas } from "./InteractiveTopologyCanvas";

interface LandingPageProps {
  stats: KeystoneStats;
  onEnterConsole: () => void;
  onLaunchScenario: (scenarioId: string) => void;
  onOpenAskKeystone: () => void;
  onOpenAuth?: (mode: 'signin' | 'onboard') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  onEnterConsole,
  onLaunchScenario,
  onOpenAskKeystone,
  onOpenAuth
}) => {
  // Interactive Showcase Tab State
  const [activeTab, setActiveTab] = useState<"engine" | "propagation" | "mincut" | "stealth">("engine");
  
  // Interactive Calculator State
  const [calcTier1Services, setCalcTier1Services] = useState<number>(4);
  const [calcSharedDeps, setCalcSharedDeps] = useState<number>(3);
  const [calcDailyVolume, setCalcDailyVolume] = useState<number>(85); // Millions USD
  
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Quick Copy Feedback
  const [copiedPr, setCopiedPr] = useState(false);

  const handleCopyPrManifest = () => {
    const manifest = JSON.stringify({
      policy_action: "CIRCUIT_BREAKER_FREEZE",
      target_keystone: "pkg:maven/org.yaml/snakeyaml@1.33",
      freeze_scope: "enterprise_wide_auto_merge",
      recommended_min_cut: {
        target_package: "pkg:maven/com.internal/internal-data-pipeline@2.5.0",
        semver_jump: "patch",
        net_security_gain: 4,
        financial_blast_reduction: "94.2%",
        insulated_assets: ["Payment-Gateway", "Auth-IAM", "Billing-Analytics", "Order-Core"]
      }
    }, null, 2);
    navigator.clipboard.writeText(manifest);
    setCopiedPr(true);
    setTimeout(() => setCopiedPr(false), 2000);
  };

  // Scroll state for dynamic fixed topbar overlay
  const [isScrolled, setIsScrolled] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > 20 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollTop <= 20 && isScrolled) {
      setIsScrolled(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="min-h-screen w-full flex flex-col font-sans bg-white text-slate-900 overflow-y-auto overflow-x-hidden relative select-none cyber-cursor-active"
    >
      {/* Interactive Procedural Dependency Graph Canvas (Steady, calm automatic drift) */}
      <InteractiveTopologyCanvas />

      {/* Atmospheric translucent screen layer ensuring razor-sharp typography */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/70 via-white/55 to-white/70" />

      {/* Dynamic Fixed Glassmorphic Capsule Topbar Overlay */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        <header 
          className={`pointer-events-auto max-w-5xl w-full h-14 px-6 rounded-full flex items-center justify-between transition-all duration-300 backdrop-blur-xl ${
            isScrolled 
              ? 'glass-gold-nav-scrolled shadow-xl shadow-amber-900/10 scale-[0.99] py-1' 
              : 'glass-gold-nav shadow-lg shadow-amber-900/5'
          }`}
        >
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer group" onClick={onEnterConsole}>
              <img 
                src="/assets/logo.png" 
                alt="Keystone" 
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
              />
              <div className="flex items-center">
                <span className="font-heading font-bold tracking-tight text-base text-slate-950">
                  KEYSTONE
                </span>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700 font-body">
              <a href="#product" className="hover:text-slate-950 transition-colors">
                Product
              </a>
              <a href="#architecture" className="hover:text-slate-950 transition-colors">
                Architecture
              </a>
              <a href="#calculator" className="hover:text-slate-950 transition-colors">
                ROI Calculator
              </a>
              <a href="#faq" className="hover:text-slate-950 transition-colors">
                Docs
              </a>
            </nav>
          </div>

          {/* Clean Pill Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenAuth ? onOpenAuth('signin') : onEnterConsole()}
              className="px-5 py-2 rounded-full text-xs font-heading font-semibold text-slate-900 hover:text-black bg-white/95 hover:bg-white border border-[#d8be98] shadow-xs hover:shadow-amber-900/10 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </header>
      </div>

      {/* Hero Section - Full Initial Viewport Fold (Only Crystal Centerpiece visible on load) */}
      <section className="relative z-10 min-h-screen w-full flex flex-col items-center justify-between px-4 sm:px-6 pt-20 sm:pt-24 pb-6 text-center select-none">
        <div className="w-full flex-1 flex flex-col items-center justify-center max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto my-auto">
          {/* 3D Champagne-Gold & Crystal Topology Centerpiece (from gemini.png) */}
          <div className="relative w-full flex flex-col items-center justify-center">
            <img 
              src="/keystone-hero-crystal.png" 
              alt="Stop chasing 10,000 CVEs. KEYSTONE: Cut the structural keystones." 
              className="w-full max-h-[74vh] sm:max-h-[78vh] md:max-h-[80vh] object-contain drop-shadow-md select-none pointer-events-none"
              draggable={false}
            />
            {/* Accessible Semantic Heading for Screen Readers & SEO */}
            <h1 className="sr-only">
              Stop chasing 10,000 CVEs. KEYSTONE: Cut the structural keystones.
            </h1>
          </div>
        </div>

        {/* Elegant Scroll cue at the bottom of the first viewport */}
        <div 
          onClick={() => {
            if (containerRef.current) {
              containerRef.current.scrollTo({ top: window.innerHeight * 0.96, behavior: 'smooth' });
            }
          }}
          className="pt-2 pb-4 flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer group select-none"
        >
          <span className="text-[10px] font-heading font-semibold tracking-widest uppercase text-slate-400 group-hover:text-slate-700 transition-colors">
            Scroll to Explore
          </span>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-y-0.5 animate-bounce" />
        </div>
      </section>

      {/* Main Narrative & Interactive Product Showcase Section (Revealed upon scrolling) */}
      <section className="relative z-10 pt-16 md:pt-20 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Refined Subtitle */}
        <p className="font-body text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed text-slate-700 font-medium mb-12">
          Legacy scanners score open-source dependencies in isolation, burying engineering in alerts and bot pull requests. 
          <strong className="font-semibold text-slate-950"> KEYSTONE</strong> analyzes full multi-repo dependency graphs, pinpoints hidden chokepoints 
          <em> before</em> public CVEs appear, and prescribes surgical <strong className="font-semibold text-amber-900/90">minimum-cut fixes</strong> in 1 coordinated PR.
        </p>

        {/* Reimagined Interactive Product Interface Showcase Window */}
        <HeroTopologyShowcase
          onEnterConsole={onEnterConsole}
          onLaunchScenario={onLaunchScenario}
        />
      </section>

      {/* The 3-Stage Topological Engine Section */}
      <section id="architecture" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-4">
            How Keystone Works Under the Hood
          </h2>
          <p className="font-body text-sm sm:text-base leading-relaxed text-slate-600">
            A three-stage computational pipeline turning resolved dependency DAGs into surgical remediation actions.
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl border border-slate-200 bg-slate-100/80 font-heading">
            <button
              onClick={() => setActiveTab("engine")}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (activeTab === "engine" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-950")}
            >
              <Network className="w-3.5 h-3.5 text-blue-600" />
              <span>Stage 1: Structural Danger</span>
            </button>

            <button
              onClick={() => setActiveTab("propagation")}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (activeTab === "propagation" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-950")}
            >
              <Activity className="w-3.5 h-3.5 text-red-600" />
              <span>Stage 2: Realized Risk & Cascade</span>
            </button>

            <button
              onClick={() => setActiveTab("mincut")}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (activeTab === "mincut" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-950")}
            >
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-600" />
              <span>Stage 3: Minimum-Cut Prescription</span>
            </button>

            <button
              onClick={() => setActiveTab("stealth")}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer " + (activeTab === "stealth" ? "bg-white text-slate-950 shadow-xs" : "text-slate-600 hover:text-slate-950")}
            >
              <Radar className="w-3.5 h-3.5 text-amber-600" />
              <span>Stealth Infiltration Radar</span>
            </button>
          </div>
        </div>

        {/* Tab Content Box */}
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-md">
          {activeTab === "engine" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-4">
                  Find the Load-Bearing Packages Before They Break
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 mb-6">
                  Danger is not an intrinsic property of a package — it is a property of <strong>where that package sits</strong> in your dependency network. KEYSTONE identifies cut-vertices whose compromise fractures all redundant paths across your architecture.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Popularity Paradox</div>
                    <div className="text-lg font-bold mt-1 text-slate-900">OpenSSF 0.48 (Low)</div>
                    <div className="text-xs text-slate-500 mt-1">Ignored by standard alerts</div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keystone Topology</div>
                    <div className="text-lg font-bold mt-1 text-blue-600">Top 0.5% (Critical)</div>
                    <div className="text-xs text-slate-500 mt-1">Single Point of Failure</div>
                  </div>
                </div>
                <button
                  onClick={onEnterConsole}
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  <span>Explore In Live Console</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Code/Metric Box */}
              <div className="rounded-xl border border-slate-200 bg-slate-950 text-slate-200 p-6 font-mono text-xs overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <span className="text-emerald-400 font-bold">STAGE_1_GRAPH_ANALYSIS</span>
                  <span className="text-slate-400 text-[10px]">TIME_TO_CALC: 48ms</span>
                </div>
                <div className="space-y-2 leading-relaxed">
                  <div className="text-slate-500">// Tarjan Articulation Cut-Vertex Detection</div>
                  <div className="text-emerald-400">✓ Ingested 42 GitHub/GitLab repositories (CycloneDX SBOMs)</div>
                  <div className="text-red-400 font-bold">! CRITICAL ARTICULATION POINT: snakeyaml@1.33</div>
                  <div className="text-slate-300 pl-4">├── Reverse PageRank Percentile : 98.4%</div>
                  <div className="text-slate-300 pl-4">├── Betweenness Centrality      : 0.042 (Top 0.5%)</div>
                  <div className="text-amber-400 pl-4">├── Maintainer Team             : 1 Unfunded Dev (Bus Factor 1)</div>
                  <div className="text-slate-300 pl-4">└── Downstream Production Apps  : 21 Services Reachable</div>
                  <div className="mt-3 p-3 rounded bg-red-950/60 border border-red-800 text-red-300 text-[11px]">
                    FLAG: Popularity Paradox detected. CVSS is moderate, but structural risk is catastrophic.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "propagation" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold mb-4 bg-red-50 text-red-700 border border-red-200">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Dual Infection Channels & Pin Dynamics</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-4">
                  Simulate Contagion Ripple Before Merging
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 mb-6">
                  Test what happens if an open-source library or maintainer account is compromised. Keystone models permeable SemVer ranges (^, ~) vs cryptographic lockfiles, distinguishes Runtime from Build-Time channels, and calculates financial blast exposure.
                </p>
                <ul className="space-y-3 mb-6 text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Permeable Edges (P=0.95) vs Shielded Lockfiles (P=0.15)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Asset-Weighted Sinks: Multiplies blast radius by Tier-1 revenue exposure</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Herfindahl Concentration Index: Alerts on cross-portfolio epidemics</span>
                  </li>
                </ul>
                <button
                  onClick={() => onLaunchScenario("snakeyaml_hero")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 cursor-pointer"
                >
                  <span>Launch Live SnakeYAML Compromise Cascade</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-950 text-slate-200 p-6 font-mono text-xs overflow-hidden shadow-inner">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <span className="text-red-400 font-bold">PROPAGATION_SIMULATOR</span>
                  <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 text-[10px]">CONTAGION: ACTIVE</span>
                </div>
                <div className="space-y-2">
                  <div className="text-slate-400">Root Compromise: [snakeyaml] → Permeable SemVer (^)</div>
                  <div className="text-red-400">├── [internal-data-pipeline:2.4.0] (Infected in 12s)</div>
                  <div className="text-red-400">│   ├── [auth-token-service] (Infected in 24s)</div>
                  <div className="text-red-400">│   │   └── [TIER-1: Core Banking Vault] (EXPOSED)</div>
                  <div className="text-red-400">│   └── [stream-processor] (Infected in 31s)</div>
                  <div className="text-red-400">│       └── [TIER-1: User PII Database] (EXPOSED)</div>
                  <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">Reachable Chains: 4 Active</span>
                    <span className="text-red-400 font-bold">Daily Exposure: $85,000,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mincut" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold mb-4 bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>Max-Flow Min-Cut Network Optimization</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-4">
                  1 Surgical Coordinated PR Instead of 40 Bot Spams
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 mb-6">
                  Why waste developer sprints patching dozens of individual services? Keystone solves the Flow-Network Minimum Vertex Cut, identifying the single intermediate dominator package that disconnects 100% of attack paths with zero breaking changes.
                </p>
                <div className="space-y-3 mb-6 text-sm">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="font-medium text-slate-800">Single Dominator Package:</span>
                    <span className="font-mono text-blue-700 font-bold">internal-data-pipeline (2.4.0 → 2.5.0)</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="font-medium text-slate-800">Propagation Paths Severed:</span>
                    <span className="font-mono text-emerald-700 font-bold">4 / 4 (100% Inoculation)</span>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <span className="font-medium text-slate-800">Renovate Circuit Breaker:</span>
                    <span className="font-mono text-slate-800 font-bold">AUTO_FREEZE_EMITTED</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyPrManifest}
                  className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {copiedPr ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPr ? "Copied PR Manifest JSON!" : "Copy Coordinated Fix Manifest"}</span>
                </button>
              </div>

              {/* Visual Preview */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <img
                  src="/keystone-app-ui-light.jpg"
                  alt="Minimum Cut Architecture Diagram"
                  className="w-full h-auto object-cover max-h-[360px]"
                />
              </div>
            </div>
          )}

          {activeTab === "stealth" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold mb-4 bg-amber-50 text-amber-700 border border-amber-200">
                  <Radar className="w-3.5 h-3.5" />
                  <span>Sentinel Mode: CVE-Independent Infiltration Radar</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-4">
                  Detect Malicious Hijacking 30 Days Before Disclosure
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 mb-6">
                  The biggest supply-chain breaches in history (XZ Utils, Event-Stream, SolarWinds) had no CVE while the attackers were active. Keystone’s pre-CVE heuristic engine flags account takeovers, Git-to-tarball hash divergences, and suspicious transitive blooms.
                </p>
                <div className="space-y-3 mb-6 text-sm text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="font-semibold text-slate-900">FRESH_MAINTAINER:</strong> Detects newly registered contributor accounts suddenly publishing major releases.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="font-semibold text-slate-900">DIVERGENT_ARTIFACT_HASH:</strong> Verifies registry tarball sha256 against Git release tags to catch build tampering.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <strong className="font-semibold text-slate-900">CENTRALITY_VELOCITY:</strong> Alarms when a quiet package surfs a +100% adoption surge across lockfile commits.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onLaunchScenario("fresh_maintainer_anomaly")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-900 cursor-pointer"
                >
                  <span>Travel -30 Days on Forensic Timeline</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <img
                  src="/keystone-stealth-radar.jpg"
                  alt="Stealth Threat Radar"
                  className="w-full h-auto object-cover max-h-[360px]"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive ROI & Blast Exposure Calculator */}
      <section id="calculator" className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="font-heading inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-3 bg-blue-50 text-blue-700 border border-blue-200">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive ROI & Blast Model</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-4">
            Simulate Your Organization’s Chokepoint Risk
          </h2>
          <p className="font-body text-sm sm:text-base leading-relaxed text-slate-600">
            Adjust parameters to estimate your Systemic Concentration and calculate hours saved by replacing bot PR storms with minimum-cut prescriptions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-md grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Controls Column */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Ecosystem Scale Parameters</h3>
            
            {/* Slider 1 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Tier-1 Crown Jewel Services</span>
                <span className="font-mono text-blue-700 font-bold">{calcTier1Services} Services</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={calcTier1Services}
                onChange={(e) => setCalcTier1Services(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Payment gateways, user authentication, customer databases, order processing.
              </div>
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Shared Foundational Keystones</span>
                <span className="font-mono text-blue-700 font-bold">{calcSharedDeps} Cut-Vertices</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={calcSharedDeps}
                onChange={(e) => setCalcSharedDeps(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Low-level articulation dependencies (parsers, crypto wrappers, network utilities).
              </div>
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Estimated Daily Transaction Throughput</span>
                <span className="font-mono text-blue-700 font-bold">${calcDailyVolume}M / Day</span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={calcDailyVolume}
                onChange={(e) => setCalcDailyVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="text-[11px] text-slate-500 mt-1">
                Total throughput passing across mission-critical dependent microservices.
              </div>
            </div>
          </div>

          {/* Real-time Calculation Output Column */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-1">
                Calculated Risk Projection
              </div>
              <div className="text-3xl font-black text-red-600 mb-6 flex items-baseline gap-2">
                <span>${(calcDailyVolume * (calcTier1Services / 4)).toFixed(0)}M</span>
                <span className="text-xs font-normal text-slate-500">Asset Exposure</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <span className="text-slate-600">SIFI Concentration Ratio:</span>
                  <span className="font-mono font-bold text-red-600">{Math.min(95, 60 + calcSharedDeps * 7)}% in Top 5</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <span className="text-slate-600">Traditional Bot PRs Generated:</span>
                  <span className="font-mono font-bold text-amber-700">{calcTier1Services * 8} Fragmented PRs</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <span className="text-slate-600">Keystone Coordinated PRs:</span>
                  <span className="font-mono font-bold text-emerald-700">1 Single Min-Cut PR</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
                  <span className="text-slate-600">Engineering Hours Saved:</span>
                  <span className="font-mono font-bold text-blue-700">{calcTier1Services * 6} Hours / Sprint</span>
                </div>
              </div>
            </div>

            <button
              onClick={onEnterConsole}
              className="mt-6 w-full py-3 rounded-xl text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Audit Your Real Dependencies</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>



      {/* Frequently Asked Questions (FAQ) Accordion */}
      <section id="faq" className="relative z-10 py-20 px-6 max-w-5xl mx-auto w-full border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="font-heading inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-3 bg-slate-100 text-slate-700 border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Technical FAQ</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-sm sm:text-base leading-relaxed text-slate-600">
            Everything engineering leads and security executives ask about Keystone’s topology engine.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Isn't this just Snyk or Dependabot with a graph visualization on top?",
              a: "No — the underlying math is impossible within single-repo tools. Cross-repository minimum vertex cut, reverse PageRank, and Tarjan articulation points are mathematically undefined without a unified portfolio DAG. Single-repo tools lack the graph; Keystone solves the network."
            },
            {
              q: "How does Keystone prevent alert fatigue when hundreds of packages exist?",
              a: "Keystone deploys a 3-layer false-positive suppression stack: (1) Reachability filtering drops dead-code paths to 0.1x weight, (2) Dual runtime vs build-time channel isolation stops cross-contamination, and (3) Ingested VEX declarations automatically silence proven unreachables."
            },
            {
              q: "What if a proposed Minimum-Cut update introduces a brand new CVE?",
              a: "Before surfacing any recommendation, Stage 3 executes the Cascade Net Security Gain check: ΔNetGain = Paths Severed − New CVEs Introduced ≥ 0. If an upgrade target version contains known vulnerabilities in OSV, Keystone automatically rejects it and seeks an alternative dominator."
            },
            {
              q: "Can Keystone analyze private internal repositories and closed packages?",
              a: "Yes. In addition to the Google deps.dev public API, Keystone natively ingests standard CycloneDX and SPDX SBOM JSON formats as well as package-lock.json, pom.xml, and poetry.lock files directly from enterprise CI/CD runners."
            },
            {
              q: "How does the Renovate Circuit Breaker work in production?",
              a: "When Keystone identifies an escalating keystone or stealth anomaly, it emits a standardized JSON policy directive that hooks into Renovate or Dependabot configurations to halt automatic PR merges enterprise-wide until security review completes."
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white transition-all overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                >
                  <span className={isOpen ? "text-blue-600" : ""}>
                    {item.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-blue-600" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs leading-relaxed border-t border-slate-100 pt-3 text-slate-600">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Bottom Call To Action */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto w-full text-center">
        <div className="rounded-2xl border border-slate-200 p-12 md:p-16 bg-slate-950 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-6">
              Experience the Keystone Topology Console
            </h2>
            <p className="font-body text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
              Explore your live ecosystem topology, simulate targeted breaches, and generate coordinated 
              multi-repo mitigations in seconds.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onEnterConsole}
                className="font-heading flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Network className="w-4 h-4" />
                <span>Enter Live Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAskKeystone}
                className="font-heading flex items-center gap-2 px-6 py-4 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-sm font-semibold transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Talk to Keystone AI Copilot</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Light-mode Enterprise Footer */}
      <footer className="w-full border-t border-slate-200 py-10 px-6 text-xs bg-slate-50 text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/logo.png" 
              alt="Keystone" 
              className="w-7 h-7 object-contain" 
            />
            <span className="font-bold tracking-tight text-slate-900">KEYSTONE</span>
            <span>— Deterministic Software Supply Chain Intelligence System</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-600">
            <button onClick={onEnterConsole} className="hover:text-slate-950 transition-colors cursor-pointer">
              3D Topology Console
            </button>
            <button onClick={onOpenAskKeystone} className="hover:text-slate-950 transition-colors cursor-pointer">
              NLQ AI Copilot
            </button>
            <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-200 text-slate-700">
              CycloneDX & SPDX Compliant
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
