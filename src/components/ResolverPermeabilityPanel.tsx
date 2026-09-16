import React, { useState } from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { 
  Network, 
  AlertTriangle, 
  ShieldX, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Table, 
  ShieldAlert, 
  ArrowRight,
  Flame,
  Bug,
  Code
} from 'lucide-react';

interface ResolverPermeabilityPanelProps {
  node: EcosystemNode;
  className?: string;
}

export const ResolverPermeabilityPanel: React.FC<ResolverPermeabilityPanelProps> = ({ node, className = '' }) => {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'evidence' | 'sandbox' | 'config'>('evidence');
  const [copied, setCopied] = useState(false);

  // Attack simulation sandbox state
  const [simulatedVersion, setSimulatedVersion] = useState('99.0.0');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{
    tested: boolean;
    poisonedResolved: boolean;
    candidateVersion: string;
    resolvedRegistry: string;
    resolverLog: string[];
  } | null>(null);

  // Only render if dependency confusion is signaled or f6Vector exists
  const isConfusion = node.stealthSignals?.includes('DEPENDENCY_CONFUSION') || node.f6Vector !== undefined;
  if (!isConfusion) {
    return null;
  }

  const vector = node.f6Vector || {
    O: 'PRIVATE',
    C: 1,
    E: 'PUB_RESOLVABLE',
    Q: 'COMPATIBLE'
  };

  const decision = node.f6Decision || 'Row 4: GRAPH_INJECTION_EXPOSURE_CONFIRMED';

  const handleCopy = () => {
    navigator.clipboard.writeText(`@internal:registry=https://artifactory.corp.internal/artifactory/api/npm/npm-virtual/\nregistry=https://registry.npmjs.org/\nstrict-ssl=true`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runAttackSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimResults({
        tested: true,
        poisonedResolved: true,
        candidateVersion: simulatedVersion,
        resolvedRegistry: 'https://registry.npmjs.org (Public Squat)',
        resolverLog: [
          `[1] Ingestion manifest parsed: dependency "${node.name}@^1.0.0" requested`,
          `[2] .npmrc lacks scoped "@${node.name.split('/')[0] || 'internal'}:registry" override`,
          `[3] Default public upstream queried: registry.npmjs.org`,
          `[4] Attacker coordinate found: ${node.name}@${simulatedVersion}`,
          `[5] SemVer resolver constraint check: ${simulatedVersion} > 1.2.0 (Highest SemVer takes precedence)`,
          `[!] CRITICAL: Poisoned public candidate ${simulatedVersion} resolved over internal artifact.`
        ]
      });
    }, 600);
  };

  // 10-State Decision Table definition
  const decisionTableRows = [
    { row: 1, o: 'PUBLIC', c: '0', e: 'PRIVATE_ONLY', q: 'INCOMPATIBLE', verdict: 'CLEAN_PUBLIC', risk: 'low' },
    { row: 2, o: 'PRIVATE', c: '0', e: 'PRIVATE_ONLY', q: 'INCOMPATIBLE', verdict: 'CLEAN_PRIVATE', risk: 'low' },
    { row: 3, o: 'PRIVATE', c: '1', e: 'PRIVATE_ONLY', q: 'COMPATIBLE', verdict: 'COLLISION_INSULATED', risk: 'medium' },
    { row: 4, o: 'PRIVATE', c: '1', e: 'PUB_RESOLVABLE', q: 'COMPATIBLE', verdict: 'GRAPH_INJECTION_EXPOSURE_CONFIRMED', risk: 'critical', active: true },
    { row: 5, o: 'PRIVATE', c: '1', e: 'PUB_RESOLVABLE', q: 'INCOMPATIBLE', verdict: 'COLLISION_VERSION_RESTRICTED', risk: 'medium' },
    { row: 6, o: 'PRIVATE', c: '1', e: 'UNKNOWN', q: 'COMPATIBLE', verdict: 'GRAPH_INJECTION_EXPOSURE_PLAUSIBLE', risk: 'high' },
    { row: 7, o: 'PRIVATE', c: '0', e: 'PUB_RESOLVABLE', q: 'COMPATIBLE', verdict: 'UNCLAIMED_NAMESPACE_VULNERABLE', risk: 'high' },
    { row: 8, o: 'UNKNOWN', c: '1', e: 'PUB_RESOLVABLE', q: 'COMPATIBLE', verdict: 'AMBIGUOUS_ORIGIN_EXPOSURE', risk: 'high' },
    { row: 9, o: 'PRIVATE', c: '0', e: 'UNKNOWN', q: 'UNKNOWN', verdict: 'UNVERIFIED_INTERNAL_ORIGIN', risk: 'medium' },
    { row: 10, o: 'PUBLIC', c: '1', e: 'PUB_RESOLVABLE', q: 'COMPATIBLE', verdict: 'STANDARD_PUBLIC_RESOLVED', risk: 'low' },
  ];

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all ${
      isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-950/60 text-amber-400'}`}>
            <Network className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                Resolver Exposure Lab
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-950/50 text-amber-300 border-amber-800'
              }`}>
                Dependency Confusion
              </span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Deterministic 4D Vector: (Origin, Collision, Exposure, Compatibility)
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${
          isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-950/60 text-red-300 border-red-800'
        }`}>
          Exposure Confirmed
        </span>
      </div>

      {/* Tabs */}
      <div className={`flex items-center gap-2 border-b pb-1 text-xs font-semibold ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
            activeTab === 'evidence'
              ? isLight ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Table className="w-3 h-3" />
          <span>4D Vector & Decision Table</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
            activeTab === 'sandbox'
              ? isLight ? 'bg-amber-600 text-white' : 'bg-amber-600 text-white'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-3 h-3" />
          <span>Attack Simulation Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 text-[11px] ${
            activeTab === 'config'
              ? isLight ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
              : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3 h-3" />
          <span>Config (.npmrc) Inspector</span>
        </button>
      </div>

      {/* TAB 1: 4D EVIDENCE VECTOR & 10-STATE TABLE */}
      {activeTab === 'evidence' && (
        <div className="flex flex-col gap-3">
          {/* 4D Vector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-slate-500 uppercase">O: Origin</div>
              <div className="font-mono text-xs font-bold mt-1 text-blue-600 dark:text-blue-400">
                {vector.O}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Private repo package</div>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-slate-500 uppercase">C: Collision</div>
              <div className="font-mono text-xs font-bold mt-1 text-amber-600 dark:text-amber-400">
                {vector.C} PUBLIC HIT
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">npmjs coordinate squat</div>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-slate-500 uppercase">E: Exposure</div>
              <div className="font-mono text-xs font-bold mt-1 text-red-600 dark:text-red-400">
                {vector.E}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Unscoped resolution</div>
            </div>

            <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="text-[10px] font-mono text-slate-500 uppercase">Q: SemVer</div>
              <div className="font-mono text-xs font-bold mt-1 text-purple-600 dark:text-purple-400">
                {vector.Q}
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">Range satisfies public tag</div>
            </div>
          </div>

          {/* Decision Banner */}
          <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs ${
            isLight ? 'bg-red-50/80 border-red-200 text-red-900' : 'bg-red-950/30 border-red-800 text-red-200'
          }`}>
            <ShieldX className="w-4 h-4 text-red-500 shrink-0" />
            <div className="flex-1">
              <div className="font-bold text-[11px] font-mono">{decision}</div>
              <div className="text-[10px] opacity-90">
                Automated CI/CD build runner will pull poisoned public release over private artifactory.
              </div>
            </div>
          </div>

          {/* Deterministic 10-State Decision Table */}
          <div className="flex flex-col gap-1.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Deterministic 10-State Resolver Decision Table (§3.7)</span>
              <span className="text-red-500 font-mono">Row 4 Active</span>
            </div>

            <div className={`rounded-lg border overflow-hidden text-[10px] font-mono ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-950 text-slate-400'}>
                    <th className="p-1.5">Row</th>
                    <th className="p-1.5">O</th>
                    <th className="p-1.5">C</th>
                    <th className="p-1.5">E</th>
                    <th className="p-1.5">Q</th>
                    <th className="p-1.5">Verdict Mapping</th>
                  </tr>
                </thead>
                <tbody>
                  {decisionTableRows.map((r) => (
                    <tr 
                      key={r.row} 
                      className={`border-t transition-colors ${
                        r.active
                          ? isLight
                            ? 'bg-red-50 border-red-300 font-bold text-red-900'
                            : 'bg-red-950/50 border-red-800 font-bold text-red-200 ring-1 ring-red-600'
                          : isLight
                          ? 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          : 'border-slate-800/80 hover:bg-slate-900/50 text-slate-400'
                      }`}
                    >
                      <td className="p-1.5">{r.row} {r.active ? '★' : ''}</td>
                      <td className="p-1.5">{r.o}</td>
                      <td className="p-1.5">{r.c}</td>
                      <td className="p-1.5">{r.e}</td>
                      <td className="p-1.5">{r.q}</td>
                      <td className="p-1.5">
                        <span className={r.active ? 'text-red-600 dark:text-red-400' : ''}>
                          {r.verdict}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ATTACK SIMULATION SANDBOX */}
      {activeTab === 'sandbox' && (
        <div className="flex flex-col gap-3 text-xs">
          <div className={`p-3 rounded-lg border ${
            isLight ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-amber-950/20 border-amber-900/50 text-amber-200'
          }`}>
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Attacker Injection Simulator: Public Coordinate Poisoning</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Simulate an adversary publishing high-version artifact coordinates on public registries to test build-system resolver permeability.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-slate-500 text-[11px]">Coordinate:</span>
              <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-bold">
                {node.name}
              </code>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-mono text-slate-500 text-[11px]">Candidate Version:</span>
              <input
                type="text"
                value={simulatedVersion}
                onChange={(e) => setSimulatedVersion(e.target.value)}
                className={`w-24 px-2 py-1 rounded border font-mono text-[11px] ${
                  isLight ? 'bg-white border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
                placeholder="99.0.0"
              />
            </div>

            <button
              onClick={runAttackSimulation}
              disabled={isSimulating}
              className="px-3 py-1 rounded text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isSimulating ? 'Simulating Resolution...' : 'Simulate Attack'}</span>
            </button>
          </div>

          {simResults && (
            <div className={`p-3 rounded-lg border flex flex-col gap-2 font-mono text-[11px] ${
              isLight ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-black text-slate-100 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-[10px] text-slate-400">
                <span>SIMULATED RESOLVER EXECUTION TRACE</span>
                <span className="text-red-400 font-bold">PIPELINE COMPROMISED</span>
              </div>

              <div className="flex flex-col gap-1 text-slate-300">
                {simResults.resolverLog.map((log, idx) => (
                  <div key={idx} className={log.startsWith('[!]') ? 'text-red-400 font-bold mt-1' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CONFIG VIEWER (.npmrc) */}
      {activeTab === 'config' && (
        <div className="flex flex-col gap-2.5">
          <div className={`p-3 rounded-lg border font-mono text-xs flex flex-col gap-2 ${
            isLight ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-black text-slate-200 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>.npmrc (Ecosystem Resolver Ingestion Manifest)</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[10px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied Remediation' : 'Copy Scoped Fix'}</span>
              </button>
            </div>

            <div className="text-[11px] leading-relaxed overflow-x-auto">
              <div className="text-slate-400">1 | registry=https://registry.npmjs.org/</div>
              <div className="text-red-400 bg-red-950/70 px-1.5 py-0.5 my-1 rounded border border-red-800/80">
                2 | # DEFECT (LINE 2): Missing exclusive @internal scope binding.
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;# Public npm coordinates are polled during build resolution.
              </div>
              <div className="text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 my-1 rounded border border-emerald-800/80">
                3 | # REMEDIATION:
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;@internal:registry=https://artifactory.corp.internal/artifactory/api/npm/npm-virtual/
              </div>
              <div className="text-slate-400">4 | strict-ssl=true</div>
              <div className="text-slate-400">5 | always-auth=false</div>
            </div>
          </div>

          <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
            isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
          }`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Hardening Rule:</strong> Binding explicit <code>@scope:registry</code> isolates private packages and drops public registry fallback candidates.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
