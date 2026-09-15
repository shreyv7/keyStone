import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  Mail, 
  User, 
  Globe2, 
  GitBranch, 
  Terminal, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  KeyRound,
  FileCode2,
  Server,
  Zap,
  Check,
  Eye,
  EyeOff,
  SlidersHorizontal,
  RefreshCw,
  X
} from 'lucide-react';
import { UserProfile, RoleLens, OnboardingConfig } from '../types';
import { useTheme } from '../context/ThemeContext';

interface AuthOnboardingModalProps {
  initialMode?: 'signin' | 'onboard';
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const AuthOnboardingModal: React.FC<AuthOnboardingModalProps> = ({
  initialMode = 'signin',
  onComplete,
  onCancel
}) => {
  const { isLight } = useTheme();
  const [mode, setMode] = useState<'signin' | 'onboard'>(initialMode);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Onboarding Wizard State (Steps 1 to 4)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [hostingRegion, setHostingRegion] = useState('us-east-1');
  const [roleLens, setRoleLens] = useState<RoleLens>('developer');
  const [securityPriorities, setSecurityPriorities] = useState<string[]>([
    'eliminate_alert_fatigue',
    'pre_cve_stealth',
    'min_cut_prs'
  ]);
  const [ingestionSource, setIngestionSource] = useState<'github_app' | 'gitlab' | 'sbom_upload'>('github_app');
  const [repoCount, setRepoCount] = useState<number>(42);

  // Step 4 Simulation State
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanPhaseIndex, setScanPhaseIndex] = useState<number>(0);
  const [isScanDone, setIsScanDone] = useState<boolean>(false);

  // Canvas ref for animated mini graph
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Background Mini-Graph for Left Panel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Nodes for topological graph
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      label: string;
      isKeystone?: boolean;
    }> = [
      { x: width * 0.5, y: height * 0.52, vx: 0.1, vy: 0.08, radius: 14, color: '#ef4444', label: 'snakeyaml (Keystone)', isKeystone: true },
      { x: width * 0.28, y: height * 0.35, vx: -0.15, vy: 0.1, radius: 7, color: '#38bdf8', label: 'jackson-databind' },
      { x: width * 0.72, y: height * 0.38, vx: 0.12, vy: -0.1, radius: 8, color: '#06b6d4', label: 'spring-core' },
      { x: width * 0.22, y: height * 0.65, vx: -0.08, vy: -0.12, radius: 9, color: '#10b981', label: 'Auth Svc (Tier-1)' },
      { x: width * 0.78, y: height * 0.68, vx: 0.1, vy: 0.15, radius: 10, color: '#10b981', label: 'Payment Gateway' },
      { x: width * 0.5, y: height * 0.25, vx: 0.05, vy: -0.08, radius: 6, color: '#6366f1', label: 'commons-lang3' },
      { x: width * 0.45, y: height * 0.8, vx: -0.1, vy: 0.05, radius: 9, color: '#10b981', label: 'Order Processing' },
      { x: width * 0.65, y: height * 0.2, vx: -0.05, vy: 0.1, radius: 5, color: '#94a3b8', label: 'log4j-api' },
      { x: width * 0.35, y: height * 0.18, vx: 0.08, vy: -0.05, radius: 5, color: '#94a3b8', label: 'slf4j-api' },
    ];

    const links = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 6],
      [1, 5], [2, 7], [1, 8], [3, 6], [4, 6]
    ];

    let pulse = 0;

    const render = () => {
      pulse += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 36;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update node positions with gentle floating
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 40 || node.x > width - 40) node.vx *= -1;
        if (node.y < 40 || node.y > height - 40) node.vy *= -1;
      });

      // Draw edges with flow packets
      links.forEach(([i, j]) => {
        const n1 = nodes[i];
        const n2 = nodes[j];
        if (!n1 || !n2) return;

        const isKeystoneLink = n1.isKeystone || n2.isKeystone;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isKeystoneLink 
          ? 'rgba(239, 68, 68, 0.28)' 
          : 'rgba(56, 189, 248, 0.16)';
        ctx.lineWidth = isKeystoneLink ? 2 : 1;
        ctx.stroke();

        // Flow particle
        const t = (Math.sin(pulse + i * 0.7) + 1) / 2;
        const px = n1.x + (n2.x - n1.x) * t;
        const py = n1.y + (n2.y - n1.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, isKeystoneLink ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isKeystoneLink ? '#ef4444' : '#38bdf8';
        ctx.shadowColor = isKeystoneLink ? '#ef4444' : '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach(node => {
        if (node.isKeystone) {
          // Outer pulse rings
          const ringRadius = node.radius + 8 + Math.sin(pulse) * 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, ringRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 - Math.sin(pulse) * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.isKeystone ? 18 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + node.radius + 13);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Step 4 Scanning Simulation
  useEffect(() => {
    if (mode !== 'onboard' || currentStep !== 4) return;

    setScanProgress(0);
    setScanPhaseIndex(0);
    setIsScanDone(false);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanDone(true);
          return 100;
        }
        const next = prev + 3;
        if (next > 25 && next <= 55) setScanPhaseIndex(1);
        else if (next > 55 && next <= 85) setScanPhaseIndex(2);
        else if (next > 85) setScanPhaseIndex(3);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [mode, currentStep]);

  const handleSignIn = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      const resolvedEmail = signInEmail.trim() || 'sec-ops@acme-corp.com';
      onComplete({
        name: 'Alex Chen',
        email: resolvedEmail,
        organization: 'Acme Global Infrastructure',
        roleLens: 'developer',
        region: 'us-east-1',
        scopeCount: 42,
        avatarInitials: 'AC',
        licenseTier: 'Enterprise Active'
      });
    }, 800);
  };

  const handleFinishOnboarding = () => {
    const resolvedName = name.trim() || 'Alex Chen';
    const initials = resolvedName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AC';

    onComplete({
      name: resolvedName,
      email: email.trim() || 'sec-ops@acme-corp.com',
      organization: organization.trim() || 'Acme Global Infrastructure',
      roleLens,
      region: hostingRegion,
      scopeCount: repoCount,
      avatarInitials: initials,
      licenseTier: 'Enterprise Active'
    });
  };

  const togglePriority = (id: string) => {
    setSecurityPriorities(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className={`fixed inset-0 z-50 w-full h-full min-h-screen overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row transition-all animate-in fade-in duration-200 ${
      isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* ========================================================================= */}
      {/* LEFT PANEL: Rich Showcase, Live Topology Animation & Enterprise Proof     */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-5/12 xl:w-5/12 bg-gradient-to-br from-slate-950 via-[#070d1a] to-[#0b162b] text-white p-8 lg:p-12 xl:p-16 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 shrink-0">
          {/* Animated Canvas Layer */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Radial Glow Overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Hero Value Statement */}
          <div className="relative z-10 pt-4">
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
                Map every dependency. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300">
                  Neutralize every chokepoint.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-lg">
                Gain architectural visibility across your entire multi-repo estate. Identify single points of failure, simulate cascade contagion, and orchestrate surgical fixes with zero breaking changes.
              </p>
            </div>
          </div>

          {/* Core Architectural Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Enterprise Multi-Repo DAG</h4>
                <p className="text-[11px] text-slate-400">Unify 40+ repositories into one continuous dependency flow network.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0 mt-0.5 text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">Tarjan Articulation Points</h4>
                <p className="text-[11px] text-slate-400">Isolate single points of failure and stealth maintainer takeovers on Day -400.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100">1 Coordinated PR vs. 40 Bot PRs</h4>
                <p className="text-[11px] text-slate-400">Flow-network minimum cut algorithms prescribe surgical remediations with zero breaks.</p>
              </div>
            </div>
          </div>

          {/* Compliance Badges Footer */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              <span>SOC2 Type II</span>
              <span>•</span>
              <span>ISO 27001</span>
              <span>•</span>
              <span>CycloneDX & SPDX</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: Auth & Multi-Step Onboarding Controls                        */}
        {/* ========================================================================= */}
        <div className={`relative w-full lg:w-7/12 xl:w-7/12 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between overflow-y-auto ${
          isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'
        }`}>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-6">
            <div 
              onClick={onCancel}
              className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity group"
              title="Return to Landing Page"
            >
              <img 
                src="/assets/logo.png" 
                alt="Keystone" 
                className="w-7 h-7 object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-extrabold tracking-tight text-sm">KEYSTONE</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <div>
                {mode === 'signin' ? (
                  <div className="text-xs text-slate-500">
                    <span>No account yet? </span>
                    <button
                      onClick={() => setMode('onboard')}
                      className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Sign Up & Onboard
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    <span>Already registered? </span>
                    <button
                      onClick={() => setMode('signin')}
                      className="font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={onCancel}
                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                  isLight 
                    ? 'border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100' 
                    : 'border-slate-800 text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Close and return to Landing Page"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ======================================================= */}
          {/* MODE 1: SIGN IN VIEW                                   */}
          {/* ======================================================= */}
          {mode === 'signin' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-md mx-auto w-full py-4 my-auto">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Log in with your enterprise credentials or organization SSO
                </p>
              </div>

              {/* Elevated 1-Click SSO Card (Snyk Reference Upgrade) */}
              <div 
                onClick={handleSignIn}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer group flex items-center justify-between ${
                  isLight 
                    ? 'border-slate-300 hover:border-slate-900 bg-slate-50/50 hover:bg-slate-50 shadow-xs' 
                    : 'border-slate-800 hover:border-cyan-500/80 bg-slate-950/40 hover:bg-slate-950/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    {/* GitHub Mark SVG */}
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Continue with GitHub</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                      isLight 
                        ? 'bg-slate-100 text-slate-700 border-slate-300' 
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      Instant SSO
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Alternative SSO Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleSignIn}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isLight 
                      ? 'border-slate-200 hover:bg-slate-50 text-slate-700' 
                      : 'border-slate-800 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Okta / SAML SSO</span>
                </button>
                <button
                  onClick={handleSignIn}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    isLight 
                      ? 'border-slate-200 hover:bg-slate-50 text-slate-700' 
                      : 'border-slate-800 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5 text-orange-500" />
                  <span>GitLab Workspace</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className={`absolute px-3 text-[11px] uppercase tracking-wider font-mono font-medium ${
                  isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'
                }`}>
                  or with work email
                </span>
              </div>

              {/* Standard Email / Password Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="name@company.com"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs transition-all focus:outline-hidden ${
                        isLight 
                          ? 'border-slate-200 focus:border-slate-900 bg-white' 
                          : 'border-slate-800 focus:border-cyan-500 bg-slate-950/60'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Password
                    </label>
                    <a href="#reset" className="text-[11px] text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className={`w-full pl-9 pr-9 py-2 rounded-lg border text-xs transition-all focus:outline-hidden ${
                        isLight 
                          ? 'border-slate-200 focus:border-slate-900 bg-white' 
                          : 'border-slate-800 focus:border-cyan-500 bg-slate-950/60'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
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
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-xs text-slate-500">Remember this login</span>
                  </label>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full mt-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Authenticating credentials...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* No account / Onboarding Callout Card */}
              <div className={`mt-4 p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
              }`}>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Don't have an account?
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Set up your workspace & map your topology in 2 minutes.
                  </div>
                </div>
                <button
                  onClick={() => setMode('onboard')}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Sign Up & Onboard</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* MODE 2: USER ONBOARDING WIZARD (4 STEPS)               */}
          {/* ======================================================= */}
          {mode === 'onboard' && (
            <div className="space-y-6 animate-in fade-in duration-200 max-w-lg mx-auto w-full py-4 my-auto">
              {/* Wizard Steps Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Step {currentStep} of 4: {' '}
                    {currentStep === 1 && 'Organization & Identity'}
                    {currentStep === 2 && 'Security Lens & Priorities'}
                    {currentStep === 3 && 'Repository Scope & Ingestion'}
                    {currentStep === 4 && 'Topological Graph Synthesis'}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {Math.round((currentStep / 4) * 100)}% Completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />
                </div>
              </div>

              {/* ---------------------------------------------------- */}
              {/* STEP 1: Account Profile & Organization Setup        */}
              {/* ---------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">Configure your security workspace</h3>
                    <p className="text-xs text-slate-500">
                      Specify your identity and data residency compliance boundaries.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Full Name</label>
                      <div className="relative">
                        <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Chen"
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${
                            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/60'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Work Email</label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${
                            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/60'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Organization / Enterprise</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Acme Global Infrastructure"
                        className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${
                          isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-950/60'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Data Residency & Jurisdiction</label>
                    <select
                      value={hostingRegion}
                      onChange={(e) => setHostingRegion(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer ${
                        isLight ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-800 bg-slate-950 text-slate-200'
                      }`}
                    >
                      <option value="in-south-1">🇮🇳 India — DPDP / Indian Data Residency</option>
                      <option value="eu-central-1">🇪🇺 EU — GDPR / EU Data Residency</option>
                      <option value="us-east-1">🇺🇸 United States — SOC 2 / US Data Residency</option>
                      <option value="uk-south-1">🇬🇧 UK — UK GDPR</option>
                      <option value="ca-central-1">🇨🇦 Canada — Canadian Data Residency</option>
                      <option value="sg-central-1">🇸🇬 Singapore — PDPA</option>
                      <option value="au-southeast-1">🇦🇺 Australia — Privacy Act</option>
                      <option value="govcloud-us">🛡️ US Government — FedRAMP / ITAR</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue: Security Lens</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* STEP 2: Role Lens & Security Threat Objectives      */}
              {/* ---------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">Select your perspective & threat model</h3>
                    <p className="text-xs text-slate-500">
                      Keystone tailors telemetry, graph weights, and PR prescriptions to your role.
                    </p>
                  </div>

                  {/* Role Card Selector */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'ciso', title: 'Executive / CISO', icon: ShieldAlert, desc: 'Blast radius & dollar-loss exposure' },
                      { id: 'developer', title: 'AppSec Lead', icon: SlidersHorizontal, desc: 'Tarjan cut-vertices & PageRank' },
                      { id: 'maintainer', title: 'Platform Dev', icon: Terminal, desc: '1-Click atomic coordinated PRs' },
                    ].map((role) => {
                      const Icon = role.icon;
                      const isSelected = roleLens === role.id;
                      return (
                        <div
                          key={role.id}
                          onClick={() => setRoleLens(role.id as RoleLens)}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                            isSelected
                              ? isLight 
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs' 
                                : 'border-cyan-500 bg-cyan-950/30 shadow-xs'
                              : isLight 
                                ? 'border-slate-200 hover:border-slate-300 bg-white' 
                                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                            {isSelected && <Check className="w-3 h-3 text-blue-600 dark:text-cyan-400" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{role.title}</div>
                            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{role.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Priority Checkbox Pills */}
                  <div>
                    <label className="block text-xs font-semibold mb-2">
                      Primary Security Objectives (Select all that apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'eliminate_alert_fatigue', label: 'Eliminate 94% CVE Alert Fatigue' },
                        { id: 'pre_cve_stealth', label: 'Pre-CVE Maintainer Hijack Detection' },
                        { id: 'min_cut_prs', label: 'Atomic 1-Click Minimum Cut PRs' },
                        { id: 'cyclonedx_sbom', label: 'Continuous CycloneDX/SPDX Sync' },
                        { id: 'namespace_squatting', label: 'Private PURL Namespace Enforcer' },
                      ].map((p) => {
                        const isChecked = securityPriorities.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePriority(p.id)}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                              isChecked
                                ? isLight ? 'bg-slate-100 border-slate-400 font-semibold' : 'bg-slate-800 border-slate-600 font-semibold'
                                : isLight ? 'border-slate-200 hover:bg-slate-50 text-slate-600' : 'border-slate-800 hover:bg-slate-800/40 text-slate-400'
                            }`}
                          >
                            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                              isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-400'
                            }`}>
                              {isChecked && <Check className="w-2.5 h-2.5" />}
                            </div>
                            <span>{p.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Continue: Ingest Repos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* STEP 3: Repository Scope & Ingestion Connection     */}
              {/* ---------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold">Connect your code ecosystem</h3>
                    <p className="text-xs text-slate-500">
                      Choose how Keystone ingests dependency manifests and lockfiles.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'github_app',
                        title: 'Connect GitHub Organization',
                        desc: 'Read-only access to package-lock.json, pom.xml, and go.mod across your repositories.',
                        badge: 'Automated Sync'
                      },
                      {
                        id: 'sbom_upload',
                        title: 'Upload CycloneDX / SPDX SBOM',
                        desc: 'Directly parse lockfile or software bill-of-materials artifact.',
                        badge: 'Air-Gapped / Static'
                      },
                      {
                        id: 'gitlab',
                        title: 'GitLab / Bitbucket Pipeline',
                        desc: 'Integrate into existing CI runners using our containerized runner.',
                        badge: 'Self-Hosted'
                      }
                    ].map((opt) => {
                      const isSelected = ingestionSource === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setIngestionSource(opt.id as any)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? isLight 
                                ? 'border-blue-600 bg-blue-50/40 shadow-xs' 
                                : 'border-cyan-500 bg-cyan-950/30 shadow-xs'
                              : isLight 
                                ? 'border-slate-200 hover:border-slate-300 bg-white' 
                                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-blue-600 dark:border-cyan-400 bg-blue-600 dark:bg-cyan-400' : 'border-slate-400'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center gap-2">
                                <span>{opt.title}</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                  {opt.badge}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500">{opt.desc}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setCurrentStep(4)}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Visualize</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------- */}
              {/* STEP 4: Live Synthesis & Chokepoint Discovery       */}
              {/* ---------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-5 text-center sm:text-left">
                  <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-500" />
                      <span>Topological Graph Synthesis</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Parsing dependency channels, mapping 5-layer DAG, and calculating Tarjan articulation points.
                    </p>
                  </div>

                  {/* Progress Gauge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Progress</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{scanProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 via-emerald-500 to-blue-600 rounded-full transition-all duration-150"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Pipeline Milestone Steps */}
                  <div className={`p-4 rounded-xl border space-y-3 text-xs ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
                  }`}>
                    {[
                      { index: 0, label: 'Manifest Ingestion: 42 enterprise repositories synchronized' },
                      { index: 1, label: 'DAG Resolution: 1,489 transitive open-source dependencies mapped' },
                      { index: 2, label: 'Tarjan Articulation Point solver: Isolated 3 structural chokepoints' },
                      { index: 3, label: 'Primary Keystone Detected: snakeyaml@1.33 (81% reachability to Payment Gateway)' }
                    ].map((step) => {
                      const isCompleted = scanPhaseIndex > step.index || isScanDone;
                      const isCurrent = scanPhaseIndex === step.index && !isScanDone;
                      return (
                        <div key={step.index} className="flex items-center gap-2.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : isCurrent ? (
                            <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-400 shrink-0" />
                          )}
                          <span className={`${
                            isCompleted ? 'text-slate-800 dark:text-slate-200 font-medium' : isCurrent ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Discovery Summary Card */}
                  {isScanDone && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between animate-in zoom-in-95 duration-200">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            Synthesis Complete — Ready to Explore
                          </div>
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                            Ecosystem topology indexed for <strong>{organization}</strong>.
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[10px] text-slate-500 hidden sm:block">
                        1 Coordinated PR Ready
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={!isScanDone}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-600 disabled:opacity-40"
                    >
                      <span>Adjust Scope</span>
                    </button>
                    <button
                      onClick={handleFinishOnboarding}
                      disabled={!isScanDone}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <span>Launch Keystone 3D Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
  );
};
