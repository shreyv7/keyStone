import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  FileCode2, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Download, 
  Terminal, 
  Check, 
  Layers, 
  Hash, 
  ExternalLink,
  ChevronRight,
  Flame,
  Info
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { RoleLens } from '../types';
import { PageHeader } from './ui/PageHeader';
import { MetricStrip } from './ui/MetricStrip';
import { Disclosure } from './ui/Disclosure';

interface RolloutCockpitViewProps {
  onReturnToGraph?: () => void;
  onOpenPRModal?: () => void;
}

export const RolloutCockpitView: React.FC<RolloutCockpitViewProps> = ({
  onReturnToGraph,
  onOpenPRModal
}) => {
  const { isLight } = useTheme();

  // State management
  const [activeLens, setActiveLens] = useState<RoleLens>('developer');
  const [isFreezeOverridden, setIsFreezeOverridden] = useState<boolean>(false);
  const [isSoakAccelerated, setIsSoakAccelerated] = useState<boolean>(false);
  const [isCohort1Promoted, setIsCohort1Promoted] = useState<boolean>(false);
  const [showOverrideConfirm, setShowOverrideConfirm] = useState<boolean>(false);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(48 * 3600 + 12 * 60 + 34); // 48h 12m 34s
  const [copiedSha, setCopiedSha] = useState<boolean>(false);
  const [downloadedReceipt, setDownloadedReceipt] = useState<boolean>(false);

  // Countdown timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const toctouSha = "7f8a9e2d5c3b1a4f890123456789abcdef0123456789abcdef0123456789abcd";
  const commitSha = "git:e84f21a09c";
  const lockfileHash = "sha256:3b1c8fa90e72...";

  const handleCopySha = () => {
    navigator.clipboard.writeText(toctouSha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleDownloadAuditTrail = () => {
    const auditData = {
      campaignId: "CAMP-2026-09-SNAKEYAML",
      targetPackage: "snakeyaml",
      currentVersion: "1.33",
      targetVersion: "2.0",
      purl: "pkg:maven/org.yaml/snakeyaml@1.33",
      timestamp: new Date().toISOString(),
      antiToctouBinding: {
        lockfileSha256: toctouSha,
        commitSha: commitSha,
        manifestHash: lockfileHash,
        integrityStatus: "CRYPTOGRAPHICALLY_VERIFIED"
      },
      cohortExecutionPlan: [
        {
          cohort: "Cohort 0 (Canary)",
          tier: 3,
          applications: ["reporting-dashboard"],
          status: "PROMOTED_100_PERCENT",
          verificationReceipt: "rcpt-c0-reporting-0x89f2",
          errorRateSpike: 0.0,
          p99LatencyMs: 22.4
        },
        {
          cohort: "Cohort 1 (Core Services)",
          tier: 2,
          applications: ["billing-analytics", "notification-svc"],
          status: isCohort1Promoted ? "PROMOTED_100_PERCENT" : isSoakAccelerated ? "SOAK_VALIDATED" : "VALIDATING_SOAK",
          soakProgress: isCohort1Promoted || isSoakAccelerated ? "100%" : "62%",
          healthScore: 99.8
        },
        {
          cohort: "Cohort 2 (Regulated Crown Jewels)",
          tier: 1,
          applications: ["payment-gateway", "auth-iam", "checkout-service"],
          status: isFreezeOverridden ? "POLICY_OVERRIDE_ACTIVE" : "HELD_SOX_FREEZE",
          freezePolicy: "SOX-FINANCIAL-CLOSE-Q3",
          holdExpirySecondsRemaining: countdownSeconds,
          residualCve: "CVE-2022-1471"
        }
      ],
      epistemicProofBoundaries: {
        evidenceScopeInvariant: "ClaimScope(E) <= ObservationScope(E)",
        staticProof: "42 JVM linkage opcodes verified; 0 introduced CVEs; acyclic dependency resolver",
        empiricalCanary: "Dynamic JavaBean reflection in Yaml.load() verified for Canary C0 (reporting-dashboard)",
        unprovenBoundary: "Dynamic reflection paths for Tier-1 payment-gateway remain UNKNOWN until freeze lifts"
      }
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keystone-rollout-audit-CAMP-2026-09-SNAKEYAML.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadedReceipt(true);
    setTimeout(() => setDownloadedReceipt(false), 3000);
  };

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex flex-col gap-5 overflow-y-auto select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616]/95 text-slate-100'
    }`}>
      <PageHeader
        title="Rollout Cockpit"
        description="Track the snakeyaml update, resolve the active deployment hold, and promote each service group safely."
        primaryAction={onOpenPRModal ? (
          <button onClick={onOpenPRModal} className="ks-btn ks-btn-primary ks-btn-md">
            <FileCode2 className="h-4 w-4" /> Review rollout PR
          </button>
        ) : undefined}
        secondaryActions={
          <>
          <button
            onClick={handleDownloadAuditTrail}
            className="ks-btn ks-btn-secondary ks-btn-md"
          >
            {downloadedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5 text-slate-400" />}
            <span>{downloadedReceipt ? 'Exported' : 'Export audit'}</span>
          </button>

          {onReturnToGraph && (
            <button
              onClick={onReturnToGraph}
              className="ks-btn ks-btn-ghost ks-btn-md"
            >
              <span>Topology</span>
            </button>
          )}
          </>
        }
      />

      <MetricStrip items={[
        { label: 'Current stage', value: isCohort1Promoted ? 'Critical services' : isSoakAccelerated ? 'Ready to promote' : 'Core service soak', detail: 'Phased deployment', tone: 'info' },
        { label: 'Rollout progress', value: isCohort1Promoted ? '100%' : isSoakAccelerated ? '67%' : '48%', detail: 'Services updated', tone: isCohort1Promoted ? 'healthy' : 'neutral' },
        { label: 'Needs attention', value: isFreezeOverridden ? 'Waiver active' : 'Deployment hold', detail: 'Critical services are waiting', tone: isFreezeOverridden ? 'warning' : 'critical' },
      ]} />

      {/* Anti-TOCTOU Cryptographic Binding Indicator & Freeze Alert Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Disclosure title="Artifact integrity" summary="Deployment artifact matches the reviewed lockfile">
          <div className="flex flex-col gap-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Lockfile SHA-256:</span>
              <div className="flex items-center gap-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">7f8a...abcd</span>
                <button
                  onClick={handleCopySha}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors"
                  title="Copy full cryptographic SHA-256 hash"
                >
                  {copiedSha ? <Check className="w-3 h-3 text-emerald-500" /> : <Hash className="w-3 h-3 text-slate-400" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Commit Head:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{commitSha}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Deployment binding:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">No drift detected</span>
            </div>
          </div>

          <div className={`text-[11px] p-2 rounded border ${
            isLight ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
          }`}>
            Cryptographic verification ensures staging artifacts match production deployment.
          </div>
        </Disclosure>

        {/* Enterprise Change Freeze Alert Card */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 lg:col-span-2 ${
          isFreezeOverridden
            ? isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-950/20 border-amber-800'
            : isLight ? 'bg-red-50/70 border-red-200 shadow-xs' : 'bg-red-950/20 border-red-900/50'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isFreezeOverridden ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {isFreezeOverridden ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Critical services are on hold
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded font-bold uppercase border ${
                    isFreezeOverridden
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                      : 'bg-red-500/20 text-red-500 border-red-500/40'
                  }`}>
                    {isFreezeOverridden ? 'WAIVER ACTIVE' : 'FINANCIAL CLOSE WINDOW'}
                  </span>
                </div>
                <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {isFreezeOverridden 
                    ? 'Security Board Emergency Waiver logged to audit ledger. Critical deployment unblocked.' 
                    : 'Critical regulated services are held in a strict validation hold window.'}
                </p>
              </div>
            </div>

            {/* Countdown Badge */}
            <div className={`px-3 py-1.5 rounded-lg border font-mono flex items-center gap-2 ${
              isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold">
                {isFreezeOverridden ? 'Waiver Active' : `Freeze Expiry: ${formatCountdown(countdownSeconds)}`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs">
              <AlertTriangle className={`w-3.5 h-3.5 ${isFreezeOverridden ? 'text-amber-500' : 'text-red-500'}`} />
              <span className={`${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <strong>Still exposed:</strong> CVE-2022-1471 remains unpatched on <code>payment-gateway</code> and <code>auth-iam</code>.
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isFreezeOverridden ? (
                <button
                  onClick={() => setShowOverrideConfirm(true)}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
                >
                  Request emergency waiver
                </button>
              ) : (
                <button
                  onClick={() => setIsFreezeOverridden(false)}
                  className="px-2.5 py-1 rounded text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white transition-colors cursor-pointer"
                >
                  Restore deployment hold
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Policy Override */}
      {showOverrideConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-5 rounded-xl border flex flex-col gap-4 shadow-xl ${
            isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-sm">Authorize Emergency Freeze Override</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bypassing the financial-close hold will allow deployment to regulated applications (<strong>payment-gateway</strong>). This action notifies the CISO, Internal Audit, and SecOps Slack channel.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowOverrideConfirm(false)}
                className="px-3 py-1.5 rounded text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsFreezeOverridden(true);
                  setShowOverrideConfirm(false);
                }}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Confirm & Sign Waiver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PHASED COHORT PROMOTION TIMELINE PIPELINE                 */}
      {/* ========================================================= */}
      <div className={`p-5 rounded-xl border flex flex-col gap-4 ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-sm tracking-tight">
              Rollout progress
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Canary services → Core services → Critical services
          </div>
        </div>

        {/* 3 Cohort Cards in Flow Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Cohort 0: Canary */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 relative transition-all ${
            isLight ? 'bg-emerald-50/50 border-emerald-300 shadow-xs' : 'bg-emerald-950/20 border-emerald-800/80'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-bold">Canary services</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase">
                Complete
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
                reporting-dashboard
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Tier-3 Internal Non-Regulated Service
              </div>
            </div>

            {/* Gate Badges */}
            <div className="flex flex-col gap-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Deploy Gate:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passed [P]
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Health Gate:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passed [P] (0 err)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Empirical Receipt:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">rcpt-c0-reporting</span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-emerald-200 dark:bg-emerald-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-full"></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>Canary Traffic</span>
                <span>100% Routed</span>
              </div>
            </div>
          </div>

          {/* Cohort 1: Core Services */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 relative transition-all ${
            isCohort1Promoted 
              ? isLight ? 'bg-emerald-50/50 border-emerald-300' : 'bg-emerald-950/20 border-emerald-800/80'
              : isLight ? 'bg-blue-50/50 border-blue-300 shadow-xs' : 'bg-blue-950/20 border-blue-800/80'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isCohort1Promoted ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
                <span className="text-xs font-bold">Core services</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                isCohort1Promoted 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-blue-500/20 text-blue-500 border border-blue-500/40'
              }`}>
                {isCohort1Promoted ? 'Complete' : isSoakAccelerated ? 'Ready' : 'Validating'}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
                billing-analytics, notification-svc
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Tier-2 Business Core Applications
              </div>
            </div>

            {/* Gate Badges */}
            <div className="flex flex-col gap-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Deploy Gate:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Passed [P]
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Health Gate:</span>
                <span className={`font-semibold flex items-center gap-1 ${
                  isCohort1Promoted || isSoakAccelerated ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-500'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {isCohort1Promoted || isSoakAccelerated ? 'Passed' : 'Validating'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Soak Period:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {isCohort1Promoted || isSoakAccelerated ? '2h 00m / 2h 00m' : '1h 14m / 2h 00m'}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${isCohort1Promoted ? 'bg-emerald-500 w-full' : isSoakAccelerated ? 'bg-blue-500 w-full' : 'bg-blue-500 w-[62%]'}`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>Soak Completion</span>
                <span>{isCohort1Promoted || isSoakAccelerated ? '100%' : '62%'}</span>
              </div>
            </div>

            {/* Interactive soak action */}
            {!isCohort1Promoted && (
              <div className="flex items-center gap-2 pt-1">
                {!isSoakAccelerated ? (
                  <button
                    onClick={() => setIsSoakAccelerated(true)}
                    className="w-full py-1 rounded text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
                  >
                    Simulate Soak Completion
                  </button>
                ) : (
                  <button
                    onClick={() => setIsCohort1Promoted(true)}
                    className="w-full py-1 rounded text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  >
                    Promote Core to 100%
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cohort 2: Regulated Crown Jewels */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between gap-3 relative transition-all ${
            isFreezeOverridden 
              ? isLight ? 'bg-amber-50/50 border-amber-300' : 'bg-amber-950/20 border-amber-800/80'
              : isLight ? 'bg-red-50/50 border-red-300 ring-1 ring-red-200' : 'bg-red-950/30 border-red-900/80 ring-1 ring-red-800/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isFreezeOverridden ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`}></span>
                <span className="text-xs font-bold">Critical services</span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                isFreezeOverridden 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40' 
                  : 'bg-red-500/20 text-red-500 border border-red-500/40'
              }`}>
                {isFreezeOverridden ? 'Waiver active' : 'On hold'}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold font-mono text-slate-800 dark:text-slate-200">
                payment-gateway, auth-iam
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Regulated payment and identity services
              </div>
            </div>

            {/* Gate Badges */}
            <div className="flex flex-col gap-1.5 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Deploy Gate:</span>
                <span className={`font-semibold flex items-center gap-1 ${isFreezeOverridden ? 'text-amber-500' : 'text-red-500'}`}>
                  {isFreezeOverridden ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {isFreezeOverridden ? 'Waiver Armed [~]' : 'Blocked [x]'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Vulnerability:</span>
                <span className="text-red-600 dark:text-red-400 font-bold">
                  CVE-2022-1471 (RCE)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Hold Expiry:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {isFreezeOverridden ? 'Waiver Active' : formatCountdown(countdownSeconds)}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${isFreezeOverridden ? 'bg-amber-500 w-[45%]' : 'bg-red-500 w-0'}`}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>Promotion Progress</span>
                <span>{isFreezeOverridden ? '45% Ready' : '0% (Held)'}</span>
              </div>
            </div>

            {/* PR modal trigger */}
            {onOpenPRModal && (
              <button
                onClick={onOpenPRModal}
                className="w-full py-1 rounded text-[11px] font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
              >
                <FileCode2 className="w-3 h-3" />
                <span>Inspect Coordinated PR Diff</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3-LENS STAKEHOLDER SWITCHER & DETAILED ACTION PLAN         */}
      {/* ========================================================= */}
      <Disclosure title="Role-specific rollout details" summary="Implementation, executive, and maintainer evidence">
        <div className="flex items-center justify-end flex-wrap gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            {(['developer', 'ciso', 'maintainer'] as const).map((lens) => (
              <button
                key={lens}
                onClick={() => setActiveLens(lens)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer border ${
                  activeLens === lens
                    ? isLight 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                      : 'bg-blue-600 text-white border-blue-500 shadow-xs'
                    : isLight 
                      ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' 
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {lens === 'developer' ? 'Developer View' : lens === 'ciso' ? 'Executive View' : 'Maintainer View'}
              </button>
            ))}
          </div>
        </div>

        {/* DEVELOPER LENS */}
        {activeLens === 'developer' && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                1. Target Repository: <code>payment-gateway</code> (root <code>pom.xml</code>)
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                ABI / AST Linkage: 42/42 Opcodes Matched
              </span>
            </div>

            {/* Code Diff Display */}
            <div className={`p-3.5 rounded-lg font-mono text-xs overflow-x-auto border ${
              isLight ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-black text-slate-100 border-slate-800'
            }`}>
              <div className="text-slate-400 pb-1 text-[11px] border-b border-slate-800 flex items-center justify-between">
                <span>diff --git a/pom.xml b/pom.xml</span>
                <span className="text-emerald-400">+7 lines / -0 lines</span>
              </div>
              <pre className="pt-2 text-[11px] leading-relaxed">
{`@@ -42,6 +42,13 @@
 <project>
   ...
+  <dependencyManagement>
+    <dependencies>
+      <dependency>
+        <groupId>org.yaml</groupId>
+        <artifactId>snakeyaml</artifactId>
+        <version>2.0</version>
+      </dependency>
+    </dependencies>
+  </dependencyManagement>`}
              </pre>
            </div>

            {/* Linkage Verification details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-1">
                  Call-Site Bytecode Integrity
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Static analysis scanned all 42 invoked methods in <code>payment-gateway</code>. All references resolve to identical JVM method descriptors in <code>snakeyaml:2.0</code>. Zero breaking bytecode incompatibilities.
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-1">
                  Transitive Dependency Pinning
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Uses Maven <code>dependencyManagement</code> root override rather than individual child bumps. Guarantees uniform version alignment across submodules without diamond conflict regressions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CISO LENS */}
        {activeLens === 'ciso' && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-emerald-50/50 border-emerald-200' : 'bg-emerald-950/20 border-emerald-900/40'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-500">Portfolio Threat Reduction</div>
                <div className="text-xl font-bold font-mono text-emerald-600 mt-1">94.2% ➔ 18.6%</div>
                <div className="text-[10px] text-slate-500 mt-0.5">-75.6 pts systemic risk</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-blue-50/50 border-blue-200' : 'bg-blue-950/20 border-blue-900/40'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-500">Regulatory SLA (PCI-DSS)</div>
                <div className="text-xl font-bold font-mono text-blue-600 mt-1">24h Compliance</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Section 6.3.2 security posture</div>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-purple-50/50 border-purple-200' : 'bg-purple-950/20 border-purple-900/40'
              }`}>
                <div className="text-[10px] uppercase font-bold text-slate-500">Residual Financial Exposure</div>
                <div className="text-xl font-bold font-mono text-purple-600 mt-1">$420K ➔ $0</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Estimated daily downtime risk</div>
              </div>
            </div>

            <div className={`p-3 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}>
              <div className="font-bold text-[11px] mb-1">Executive Compliance Briefing:</div>
              <p className="text-[11px] leading-relaxed">
                The targeted patch campaign remediates the critical deserialization RCE vulnerability in <code>snakeyaml</code> (CVE-2022-1471). Cohort 0 canary testing proved zero regression across telemetry dashboards. Core business apps in Cohort 1 are currently soaking with 99.8% health score. Regulated Crown Jewels are gated behind the SOX Q3 freeze window to preserve financial reconciliation integrity until release sign-off.
              </p>
            </div>
          </div>
        )}

        {/* MAINTAINER LENS */}
        {activeLens === 'maintainer' && (
          <div className="flex flex-col gap-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-1">
                  Diamond Resolution Convergence
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Forces 14 downstream microservices to align onto <code>snakeyaml:2.0</code>, cleanly eliminating diamond skew where multiple services transitively imported conflicting 1.28 and 1.33 versions.
                </p>
              </div>

              <div className={`p-3 rounded-lg border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 mb-1">
                  Impact isolation
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  By cutting the vulnerability propagation path at the shared <code>internal-data-pipeline</code> boundary, downstream critical services are completely protected from deserialization payloads.
                </p>
              </div>
            </div>
          </div>
        )}
      </Disclosure>

      {/* ========================================================= */}
      {/* MANDATORY EVIDENCE LIMITATION DISCLOSURE BANNER           */}
      {/* ========================================================= */}
      <Disclosure title="Verification scope and limitations" summary="What was proven statically, at runtime, and what remains unknown">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] font-mono pt-1">
          <div className={`p-2.5 rounded border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
              Static proof — verified
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Ecosystem resolver feasibility, 42 JVM linkage opcodes, 0 introduced CVEs mathematically proven.
            </div>
          </div>

          <div className={`p-2.5 rounded border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="font-bold text-blue-600 dark:text-blue-400 mb-0.5">
              Runtime canary evidence
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Dynamic JavaBean reflection in <code>Yaml.load()</code> empirically validated in Canary Cohort 0 (<code>reporting-dashboard</code>).
            </div>
          </div>

          <div className={`p-2.5 rounded border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="font-bold text-amber-600 dark:text-amber-400 mb-0.5">
              Not yet proven
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              Dynamic reflection for <code>payment-gateway</code> remains unknown until the hold lifts. Canary evidence does not automatically apply to critical services.
            </div>
          </div>
        </div>
      </Disclosure>
    </div>
  );
};
