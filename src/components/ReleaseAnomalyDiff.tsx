import React from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { AlertOctagon, ArrowRight, ShieldAlert, FileCode, CheckCircle2, XCircle, FileWarning } from 'lucide-react';

interface ReleaseAnomalyDiffProps {
  node: EcosystemNode;
  className?: string;
}

export const ReleaseAnomalyDiff: React.FC<ReleaseAnomalyDiffProps> = ({ node, className = '' }) => {
  const { isLight } = useTheme();

  // If node doesn't have stealthSignals or f4Status, return null or fallback
  if (!node.stealthSignals || node.stealthSignals.length === 0) {
    return null;
  }

  // Derive previous version
  const currentVersion = node.version;
  const versionParts = currentVersion.split('.');
  const previousVersion = versionParts.length === 3
    ? `${versionParts[0]}.${versionParts[1]}.${Math.max(0, parseInt(versionParts[2]) - 1)}`
    : 'previous';

  const f4Status = node.f4Status || (
    node.stealthSignals.includes('DIVERGENT_ARTIFACT_HASH') ? 'CORRELATED_ANOMALY' :
    node.stealthSignals.includes('NEW_DEPENDENCY_IN_PATCH') ? 'CAPABILITY_CHANGE' : 'ARTIFACT_ANOMALY'
  );

  const capabilities = node.capabilityDelta || [
    { capability: 'child_process.exec', description: 'Spawns system shell during manifest initialization' },
    { capability: 'net.Socket.connect', description: 'Outbound TCP connection to IP 198.51.100.24' }
  ];

  const artifactFiles = node.artifactFiles || [
    { file: 'lib/parser.js', type: 'JS Source', status: 'CORRESPONDING' as const },
    { file: 'build/Release/core.so', type: 'ELF Shared Object', status: 'UNEXPLAINED' as const }
  ];

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all ${
      isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-red-50 text-red-700' : 'bg-red-950/60 text-red-400'}`}>
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Release Anomaly Inspector
              </span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Detects unverified maintainer changes and artifact drift.
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
          f4Status === 'CORRELATED_ANOMALY'
            ? isLight ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-950 text-red-300 border-red-800'
            : isLight ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-800'
        }`}>
          {f4Status === 'CORRELATED_ANOMALY' ? 'Correlated Anomaly' : f4Status === 'CAPABILITY_CHANGE' ? 'Capability Change' : 'Artifact Drift'}
        </span>
      </div>

      {/* Version Comparison Bar */}
      <div className={`p-2.5 rounded-lg border flex items-center justify-between font-mono text-xs ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-sans text-[11px]">Compare Release:</span>
          <span className={`px-2 py-0.5 rounded border ${isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'}`}>
            v{previousVersion} (Clean Baseline)
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className={`px-2 py-0.5 rounded border font-bold ${
            isLight ? 'bg-red-50 text-red-800 border-red-300' : 'bg-red-950/80 text-red-300 border-red-800'
          }`}>
            v{currentVersion} (Target Ingestion)
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>SLSA:</span>
          <span className="text-red-500 font-bold">UNATTESTED</span>
        </div>
      </div>

      {/* Sensitive Capability Delta ΔC+ */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            <span>Capability Changes in Release:</span>
          </span>
          <span className="text-[10px] font-mono text-red-500 font-bold">
            +{capabilities.length} Sensitive Calls
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md border text-xs flex items-start gap-2 ${
                isLight ? 'bg-red-50/50 border-red-200' : 'bg-red-950/20 border-red-900/40'
              }`}
            >
              <code className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                isLight ? 'bg-white text-red-800 border border-red-200' : 'bg-slate-900 text-red-300 border border-red-800'
              }`}>
                + {cap.capability}
              </code>
              <span className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {cap.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Artifact-Source Matrix */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
            <FileCode className="w-3.5 h-3.5 text-indigo-500" />
            <span>Artifact Verification:</span>
          </span>
          <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            GitHub Release vs npm Tarball
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {artifactFiles.map((file, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md border flex items-center justify-between text-xs font-mono ${
                file.status === 'UNEXPLAINED'
                  ? isLight ? 'bg-red-50 border-red-200 text-red-900' : 'bg-red-950/40 border-red-800 text-red-200'
                  : isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {file.status === 'UNEXPLAINED' ? (
                  <FileWarning className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                )}
                <span className="font-semibold">{file.file}</span>
                <span className="text-[10px] text-slate-400 font-sans">({file.type})</span>
              </div>

              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                file.status === 'UNEXPLAINED'
                  ? isLight ? 'bg-red-100 text-red-800 border-red-300' : 'bg-red-950 text-red-300 border-red-700'
                  : isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-700'
              }`}>
                {file.status === 'UNEXPLAINED' ? 'UNEXPLAINED (U_A)' : 'CORRESPONDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
