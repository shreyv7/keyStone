import React, { useState, useRef } from "react";
import {
  Network,
  Activity,
  ArrowRight,
  GitPullRequest,
  ChevronDown,
  Lock,
  Mail,
  Eye,
  EyeOff,
  GitBranch,
  ShieldAlert,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Sparkles,
  Zap
} from "lucide-react";
import { KeystoneStats } from "../types";
import { InteractiveTopologyCanvas } from "./InteractiveTopologyCanvas";

interface LandingPageProps {
  stats: KeystoneStats;
  onEnterConsole: () => void;
  onLaunchScenario: (scenarioId: string) => void;
  onOpenAskKeystone: () => void;
  onOpenAuth?: (mode: "signin" | "onboard") => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stats,
  onEnterConsole,
  onLaunchScenario,
  onOpenAskKeystone,
  onOpenAuth
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sign In Form State (matching AuthOnboardingModal)
  const [signInEmail, setSignInEmail] = useState("alex.chen@acme-corp.com");
  const [signInPassword, setSignInPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onEnterConsole();
    }, 600);
  };

  const handleQuickDemo = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onLaunchScenario("snakeyaml_hero");
    }, 400);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col font-sans bg-[#080616] text-white overflow-y-auto overflow-x-hidden relative select-none scroll-smooth"
    >
      {/* Interactive Procedural Dependency Network Canvas (Deepest Void #080616 with Neon Nodes) */}
      <InteractiveTopologyCanvas theme="dark" />

      {/* Atmospheric translucent screen layer ensuring contrast */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#080616]/75 via-[#080616]/45 to-[#080616]/85" />

      {/* ─── Top Navigation Bar (Harmonized Keystone Glass Capsule) ─── */}
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header className="pointer-events-auto max-w-5xl w-full h-14 px-6 rounded-full flex items-center justify-between transition-all backdrop-blur-xl bg-[#080616]/85 border border-[#1a1953] shadow-xl shadow-black/60">
          {/* Authentic Keystone Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onEnterConsole}
          >
            <img
              src="/assets/logo.png"
              alt="Keystone"
              className="w-7 h-7 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-heading font-bold tracking-tight text-base text-white flex items-center gap-2">
              KEYSTONE
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4] animate-pulse" />
            </span>
          </div>

          {/* Nav Anchors */}
          <nav className="hidden sm:flex items-center gap-7 text-xs font-semibold text-slate-300 font-body">
            <button
              onClick={() => scrollToSection("process")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              The Process
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection("signin")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollToSection("signin")}
              className="px-5 py-2 rounded-full text-xs font-heading font-semibold text-white bg-[#2f2fe4] hover:bg-[#4343f8] transition-all cursor-pointer shadow-[0_0_15px_rgba(47,47,228,0.35)]"
            >
              Sign In
            </button>
          </div>
        </header>
      </div>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center max-w-4xl mx-auto my-auto">


        {/* Hero Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.12] mb-6">
          One compromised package.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d4d3ff] to-[#2f2fe4]">
            A hundred breached services.
          </span>
        </h1>

        {/* Hero Narrative */}
        <p className="font-body text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
          Modern software depends on deeply nested open-source graphs. Traditional
          tools evaluate packages in isolation — missing structural chokepoints and
          spamming teams with 40 disconnected alerts. 
          <strong className="text-white font-semibold"> KEYSTONE</strong> pinpoints the
          keystone dependencies before advisories exist, and severs attack paths with a single coordinated fix.
        </p>

        {/* Minimal CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mb-16">
          <button
            onClick={() => scrollToSection("process")}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-heading font-bold text-white bg-[#2f2fe4] hover:bg-[#4343f8] shadow-[0_0_20px_rgba(47,47,228,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>See The Process</span>
            <ChevronDown className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection("signin")}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-heading font-semibold text-slate-200 hover:text-white bg-[#1a1953]/50 hover:bg-[#1a1953] border border-[#162e93] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sign In to Console</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Minimalist Micro-Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-[#1a1953] text-left">
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Detection</div>
            <div className="text-base font-bold text-white mt-0.5">Day −400 Pre-CVE</div>
            <div className="text-[11px] text-slate-400">CVE-independent radar</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Topology</div>
            <div className="text-base font-bold text-[#2f2fe4] mt-0.5">Dominator Trees</div>
            <div className="text-[11px] text-slate-400">Lengauer–Tarjan chokepoints</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Remediation</div>
            <div className="text-base font-bold text-white mt-0.5">1 Coordinated PR</div>
            <div className="text-[11px] text-slate-400">Instead of 40 bot PRs</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Safety</div>
            <div className="text-base font-bold text-[#2f2fe4] mt-0.5">Zero Breakage</div>
            <div className="text-[11px] text-slate-400">AST & ABI verified</div>
          </div>
        </div>
      </section>

      {/* ─── THE PROCESS SECTION (3 ESSENTIAL FEATURES - CONCURRENT PALETTE) ─── */}
      <section id="process" className="relative z-10 py-24 px-6 max-w-4xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <div className="text-xs font-bold text-[#2f2fe4] tracking-widest uppercase mb-2">
            The Keystone Architecture
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How Keystone Works
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-3">
            Three disciplined stages that replace reactive vulnerability chasing with proactive, mathematical defense.
          </p>
        </div>

        {/* Vertical Step-by-Step Flow */}
        <div className="space-y-12 relative">
          {/* Subtle Palette Vertical Connector */}
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-px bg-gradient-to-b from-[#2f2fe4]/60 via-[#162e93]/50 to-[#1a1953]/60 -z-10" />

          {/* ─── STEP 01: TOPOLOGICAL RADAR ─── */}
          <div className="relative flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl bg-[#0d0a27]/95 border border-[#1a1953] shadow-xl shadow-black/70 hover:border-[#162e93] transition-colors">
            {/* Step Indicator Badge */}
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#1a1953] border border-[#162e93] flex flex-col items-center justify-center text-[#2f2fe4]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage</span>
              <span className="font-heading text-lg font-bold text-white">01</span>
            </div>

            {/* Content & Narrative */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Discover the Keystones Before Anyone Files a CVE
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Attacks like <strong>XZ Utils</strong> or <strong>event-stream</strong> sat inside production software for months before public discovery. Traditional scanners cannot see them because no CVE exists yet. KEYSTONE computes <strong>Directed Dominance Coverage</strong> and <strong>Downstream PageRank</strong> to reveal structural single points of failure on Day −400.
              </p>

              {/* Contrast Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#080616] border border-[#1a1953] text-xs">
                <div className="p-3 rounded-lg bg-[#0d0a27] border border-[#1a1953]/80">
                  <div className="text-slate-400 font-medium text-[11px] uppercase">Traditional Scan View</div>
                  <div className="font-semibold text-slate-200 mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>0 CVEs · Looks 100% Safe</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">High GitHub stars, zero active alerts.</p>
                </div>
                <div className="p-3 rounded-lg bg-[#1a1953]/50 border border-[#162e93]">
                  <div className="text-white font-semibold text-[11px] uppercase">Keystone Topology Radar</div>
                  <div className="font-bold text-white mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4] animate-pulse"></span>
                    <span>Structural Keystone (Top 0.5%)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">100% bottleneck across 4 core services.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── STEP 02: THE RIPPLE EFFECT ─── */}
          <div className="relative flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl bg-[#0d0a27]/95 border border-[#1a1953] shadow-xl shadow-black/70 hover:border-[#162e93] transition-colors">
            {/* Step Indicator Badge */}
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#1a1953] border border-[#162e93] flex flex-col items-center justify-center text-[#2f2fe4]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage</span>
              <span className="font-heading text-lg font-bold text-white">02</span>
            </div>

            {/* Content & Narrative */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Trace the Propagation Path to Crown Jewels
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                A vulnerability in an isolated CLI tool is low impact. But when that package is deeply embedded beneath your <strong>Payment Gateway</strong> and <strong>IAM Auth</strong>, a single exploit cascades. KEYSTONE maps the exact transmission path, factoring in EPSS exploitability, CISA KEV, and Business Impact Index (BII).
              </p>

              {/* Path Trace Visualization */}
              <div className="p-4 rounded-xl bg-[#080616] text-slate-200 border border-[#1a1953] text-xs font-mono">
                <div className="text-[11px] text-slate-400 mb-3 font-sans font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Cascade Propagation Flow</span>
                  <span className="text-[#2f2fe4] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4] animate-ping" />
                    Active Transmission
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="px-3 py-1.5 rounded bg-[#1a1953] border border-[#162e93] text-white font-bold">
                    snakeyaml@1.33
                  </div>
                  <span className="text-[#2f2fe4]">──►</span>
                  <div className="px-3 py-1.5 rounded bg-[#1a1953]/60 border border-[#1a1953] text-slate-200">
                    internal-pipeline@2.4.0
                  </div>
                  <span className="text-[#2f2fe4]">──►</span>
                  <div className="px-3 py-1.5 rounded bg-[#162e93] border border-[#2f2fe4] text-white font-bold">
                    [Payment-Gateway] + [Auth-IAM]
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── STEP 03: SURGICAL MIN-CUT ─── */}
          <div className="relative flex flex-col md:flex-row items-start gap-8 p-8 rounded-2xl bg-[#0d0a27]/95 border border-[#1a1953] shadow-xl shadow-black/70 hover:border-[#162e93] transition-colors">
            {/* Step Indicator Badge */}
            <div className="w-14 h-14 shrink-0 rounded-xl bg-[#1a1953] border border-[#162e93] flex flex-col items-center justify-center text-[#2f2fe4]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stage</span>
              <span className="font-heading text-lg font-bold text-white">03</span>
            </div>

            {/* Content & Narrative */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                1 Coordinated Fix Instead of 40 Broken PRs
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Legacy tools open 40 independent PRs across 40 repositories, creating chaos and merge conflicts. KEYSTONE calculates the <strong>Unit-Capacity Minimum Vertex Cut</strong> to find the single common ancestor. Verified via AST call-site extraction and bytecode ABI linkage to guarantee <strong>zero compilation breakage</strong>.
              </p>

              {/* Resolution Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#080616] border border-[#1a1953] text-xs">
                <div className="p-3 rounded-lg bg-[#0d0a27] border border-[#1a1953]/80 text-slate-400">
                  <div className="font-bold text-slate-300 mb-1">❌ Legacy Approach</div>
                  <ul className="space-y-1 text-[11px] text-slate-400">
                    <li>• 40 uncoordinated Dependabot PRs</li>
                    <li>• 18 CI build failures (`ERESOLVE`)</li>
                    <li>• Alert fatigue & delayed releases</li>
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-[#1a1953]/50 border border-[#162e93] text-white">
                  <div className="font-bold text-[#d4d3ff] mb-1">✅ Keystone Surgical Cut</div>
                  <ul className="space-y-1 text-[11px] text-slate-200">
                    <li>• 1 Coordinated PR in root parent</li>
                    <li>• 0 broken AST call-sites verified</li>
                    <li>• 100% attack path severed instantly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE ACTUAL LOGIN PAGE (HARMONIZED EXACT 2-COLUMN LAYOUT) ─── */}
      <section id="signin" className="relative z-10 py-24 px-6 max-w-6xl mx-auto w-full">
        <div className="rounded-3xl bg-[#0d0a27] border border-[#1a1953] shadow-2xl shadow-black/80 overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT COLUMN: ARCHITECTURAL VALUE PROPOSITION (from AuthOnboardingModal) */}
          <div className="w-full lg:w-5/12 bg-[#100d2f] p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1a1953]">
            <div>
              {/* Keystone Brand */}
              <div className="flex items-center gap-2.5 mb-8">
                <img
                  src="/assets/logo.png"
                  alt="Keystone"
                  className="w-7 h-7 object-contain"
                />
                <span className="font-heading font-bold text-white tracking-tight text-sm flex items-center gap-2">
                  KEYSTONE
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4]" />
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight leading-snug mb-4">
                Map every dependency.
                <br />
                <span className="text-[#d4d3ff]">
                  Neutralize every chokepoint.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-8">
                Gain architectural visibility across your entire multi-repo estate. Identify single points of failure, simulate cascade contagion, and orchestrate surgical fixes with zero breaking changes.
              </p>

              {/* Key Features */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1a1953] border border-[#162e93] flex items-center justify-center shrink-0 mt-0.5 text-[#2f2fe4]">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Enterprise Multi-Repo DAG</h4>
                    <p className="text-[11px] text-slate-300">Unify 40+ repositories into one continuous dependency flow network.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1a1953] border border-[#162e93] flex items-center justify-center shrink-0 mt-0.5 text-[#2f2fe4]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Tarjan Articulation Points</h4>
                    <p className="text-[11px] text-slate-300">Isolate single points of failure and stealth maintainer takeovers on Day −400.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#1a1953] border border-[#162e93] flex items-center justify-center shrink-0 mt-0.5 text-[#2f2fe4]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1 Coordinated PR vs. 40 Bot PRs</h4>
                    <p className="text-[11px] text-slate-300">Flow-network minimum cut algorithms prescribe surgical remediations with zero breaks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Footer */}
            <div className="pt-8 mt-8 border-t border-[#1a1953]/80 text-[10px] text-slate-400 uppercase tracking-widest font-mono flex items-center gap-3">
              <span>SOC2 Type II</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>CycloneDX & SPDX</span>
            </div>
          </div>

          {/* RIGHT COLUMN: THE EXACT SIGN-IN FORM (from AuthOnboardingModal) */}
          <div className="w-full lg:w-7/12 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-[#0d0a27]">
            <div className="max-w-md mx-auto w-full space-y-6">
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Welcome back</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Log in with your enterprise credentials or organization SSO
                </p>
              </div>

              {/* GitHub 1-Click SSO Card */}
              <div
                onClick={() => handleSignIn()}
                className="p-4 rounded-xl border border-[#1a1953] bg-[#1a1953]/30 hover:bg-[#1a1953]/60 hover:border-[#162e93] transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#080616] border border-[#1a1953] flex items-center justify-center text-white">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Continue with GitHub</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Alternative SSO Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleSignIn()}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#1a1953] bg-[#1a1953]/20 hover:bg-[#1a1953]/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#2f2fe4]" />
                  <span>Okta / SAML SSO</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSignIn()}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-[#1a1953] bg-[#1a1953]/20 hover:bg-[#1a1953]/50 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <GitBranch className="w-3.5 h-3.5 text-[#2f2fe4]" />
                  <span>GitLab Workspace</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-[#1a1953]" />
                <span className="absolute px-3 text-[11px] uppercase tracking-wider font-mono font-medium bg-[#0d0a27] text-slate-400">
                  or with work email
                </span>
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#2f2fe4]" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#1a1953] bg-[#080616] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2f2fe4] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Password
                    </label>
                    <a href="#signin" className="text-[11px] text-[#d4d3ff] hover:underline transition-colors">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-[#2f2fe4]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-9 pr-9 py-2 rounded-lg border border-[#1a1953] bg-[#080616] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#2f2fe4] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#1a1953] bg-[#080616] text-[#2f2fe4] focus:ring-0"
                    />
                    <span className="text-xs text-slate-300">Remember this login</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full mt-2 py-2.5 rounded-lg bg-[#2f2fe4] hover:bg-[#4343f8] text-white font-bold text-xs shadow-[0_0_20px_rgba(47,47,228,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Authenticating credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Instant Demo Button */}
              <div
                onClick={handleQuickDemo}
                className="p-3.5 rounded-xl border border-[#1a1953] bg-[#1a1953]/25 hover:bg-[#1a1953]/50 hover:border-[#162e93] transition-all cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#2f2fe4]" />
                  <div>
                    <div className="font-semibold text-white">Instant Demo Sandbox</div>
                    <div className="text-[11px] text-slate-300">Pre-loaded Acme Corp estate (42 Repos)</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Full Onboarding Link */}
              <div className="pt-2 text-center text-xs text-slate-400">
                <span>New enterprise deployment? </span>
                <button
                  onClick={() => onOpenAuth ? onOpenAuth("onboard") : onEnterConsole()}
                  className="font-bold text-[#d4d3ff] hover:underline cursor-pointer"
                >
                  Configure Onboarding Wizard →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MINIMAL FOOTER ─── */}
      <footer className="relative z-10 py-8 px-6 border-t border-[#1a1953]/80 text-center text-xs text-slate-400 font-body">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-white">KEYSTONE</span>
            <span>· Enterprise Supply Chain Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4] animate-pulse" />
              SYS_RADAR_ONLINE
            </span>
            <button
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
