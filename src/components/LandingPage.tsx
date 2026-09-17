import React, { useState, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  Globe2,
  GitBranch,
  Search,
  Wrench,
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

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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

      {/* ─── Application Navigation Bar ─── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <header className="pointer-events-auto relative z-50 h-14 w-full px-5 flex items-center justify-between transition-colors duration-150 bg-[#080616] border-b border-[#1a1953] text-slate-100">
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
              How It Works
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <button
                onClick={() => {
                  setIsLanguageOpen((isOpen) => !isOpen);
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-slate-200 transition-colors hover:text-white"
                aria-label="Select language"
                aria-expanded={isLanguageOpen}
              >
                <Globe2 className="w-4 h-4" />
                <span>EN</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLanguageOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-lg border border-slate-800 bg-[#0a0f1d] p-1 shadow-xl shadow-black/50">
                  <button
                    onClick={() => setIsLanguageOpen(false)}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-white hover:bg-slate-800"
                  >
                    <Globe2 className="w-3.5 h-3.5 text-blue-300" />
                    English
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onOpenAuth?.("signin")}
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
          Manage dependency risk
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#d4d3ff] to-[#2f2fe4]">
            across your organization.
          </span>
        </h1>

        {/* Hero Narrative */}
        <p className="font-body text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed mb-10 font-normal">
          Keystone connects dependency relationships across your software estate, prioritizes material exposure, and guides verified remediation.
        </p>

        {/* Minimal CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mb-16">
          <button
            onClick={handleQuickDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-heading font-bold text-white bg-[#2f2fe4] hover:bg-[#4343f8] shadow-[0_0_20px_rgba(47,47,228,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>View security posture</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>


          <button
            onClick={() => scrollToSection("process")}
            className="w-full sm:w-auto px-4 py-3 rounded-full text-sm font-heading text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Product overview</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minimalist Micro-Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl pt-8 border-t border-[#1a1953] text-left">
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Mapping</div>
            <div className="text-base font-bold text-white mt-0.5">Unified Inventory</div>
            <div className="text-[11px] text-slate-400">Dependencies across repositories</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Analysis</div>
            <div className="text-base font-bold text-[#2f2fe4] mt-0.5">Material Risk</div>
            <div className="text-[11px] text-slate-400">Prioritized by service impact</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Remediation</div>
            <div className="text-base font-bold text-white mt-0.5">Guided Remediation</div>
            <div className="text-[11px] text-slate-400">Coordinated changes across teams</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#0d0a27]/90 border border-[#1a1953]">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Verification</div>
            <div className="text-base font-bold text-[#2f2fe4] mt-0.5">Verified Rollout</div>
            <div className="text-[11px] text-slate-400">Compatibility evidence before release</div>
          </div>
        </div>
      </section>

      {/* ─── HOW KEYSTONE WORKS ─── */}
      <section id="process" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24">
        <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-2xl shadow-black/50 sm:p-10">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2f2fe4]">How Keystone works</p>
            <h2 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">From exposure to a precise fix</h2>
            <p className="mt-3 text-sm text-slate-400">A connected path from risk signal to verified remediation.</p>
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
            <article className="flex flex-col rounded-xl border border-red-800/60 bg-red-950/30 p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-red-800/60 bg-red-950/60 text-red-400"><Search className="size-5" /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-400">01 · Detect</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Find the shared risk</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Identify the dependency carrying risk across your critical services.</p>
              <span className="mt-auto pt-5 text-xs font-medium text-slate-400">Signal: shared exposure</span>
            </article>

            <div className="flex items-center justify-center py-1 md:py-0">
              <ArrowRight className="size-5 rotate-90 text-blue-400 md:rotate-0" />
            </div>

            <article className="flex flex-col rounded-xl border border-blue-800/60 bg-blue-950/30 p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-blue-800/60 bg-blue-950/60 text-blue-300"><GitBranch className="size-5" /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300">02 · Trace</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Map the reach</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Connect that dependency to the services, repositories, and owners it affects.</p>
              <span className="mt-auto pt-5 text-xs font-medium text-slate-400">Context: service impact</span>
            </article>

            <div className="flex items-center justify-center py-1 md:py-0">
              <ArrowRight className="size-5 rotate-90 text-emerald-400 md:rotate-0" />
            </div>

            <article className="flex flex-col rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-5">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-emerald-800/60 bg-emerald-950/60 text-emerald-300"><Wrench className="size-5" /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">03 · Resolve</span>
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Coordinate one fix</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">Plan one verified change at the root before the issue spreads further.</p>
              <span className="mt-auto pt-5 text-xs font-medium text-slate-400">Outcome: confident release</span>
            </article>
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#2f2fe4] shadow-[0_0_8px_#2f2fe4]" />
              Monitoring available
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
