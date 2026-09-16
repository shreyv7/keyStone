import React from 'react';
import { Play, ShieldAlert, AlertTriangle, ArrowRight, Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ScenariosViewProps {
  onLaunchScenario: (scenarioId: string) => void;
  onReturnToGraph: () => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  onLaunchScenario,
  onReturnToGraph
}) => {
  const { isLight } = useTheme();

  const scenarios = [
    {
      id: 'snakeyaml_hero',
      title: 'Transitive Chokepoint: snakeyaml@1.33',
      badge: 'Critical Exposure',
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
      badgeColorDark: 'bg-red-950/40 text-red-400 border-red-800/50',
      description: 'A deeply nested YAML parser acts as a Tarjan cut-vertex across 4 production services. Compromise cascades backward to Payment Gateway and Auth/IAM. A single minimum-cut upgrade on internal-data-pipeline severs all 4 paths.',
      targetPackage: 'snakeyaml@1.33',
      attackVector: 'Unsafe Deserialization Gadget Chain (CVE-2022-1471)',
      conventionalScore: '48 / 100 (Moderate)',
      systemicScore: '84 / 100 (Critical)',
      blastRadius: '21 Services, 4 Tier-1 Sinks'
    },
    {
      id: 'minimist_pollution',
      title: 'Prototype Contagion: minimist@0.0.8',
      badge: 'High Blast Radius',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeColorDark: 'bg-amber-950/40 text-amber-400 border-amber-800/50',
      description: 'Widely transitive argument parser maintained by a single author. Sits in top 0.5% of dependency paths and exposes merchant administrative services.',
      targetPackage: 'minimist@0.0.8',
      attackVector: 'Prototype Pollution (CVE-2020-7598)',
      conventionalScore: '56 / 100 (Moderate)',
      systemicScore: '78 / 100 (High)',
      blastRadius: '14 Services, 2 Tier-1 Sinks'
    },
    {
      id: 'fresh_maintainer_anomaly',
      title: 'Account Takeover: Unmaintained Library',
      badge: 'Pre-CVE Anomaly',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      badgeColorDark: 'bg-slate-800 text-slate-300 border-slate-700',
      description: 'A newly registered account takes ownership of an inactive package. KEYSTONE flags maintainer churn and artifact hash tampering 30 days before public disclosure.',
      targetPackage: 'snakeyaml@1.33 (T-30 Days)',
      attackVector: 'Maintainer Account Transfer & Artifact Hash Mismatch',
      conventionalScore: '0 / 100 (No Public Advisory)',
      systemicScore: '79 / 100 (High Risk)',
      blastRadius: 'Early Warning Signal'
    },
    {
      id: 'dep_confusion',
      title: 'Namespace Squatting: Dependency Confusion',
      badge: 'F6 Defense Active',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      badgeColorDark: 'bg-purple-950/60 text-purple-300 border-purple-800',
      description: 'An external adversary publishes a public package using an internal corporate namespace (pkg:npm/@internal/internal-data-pipeline). KEYSTONE F6 Shield normalizes purl identity, blocks registry override, and validates private repo boundaries.',
      targetPackage: 'internal-data-pipeline',
      attackVector: 'Public Registry PURL Namespace Squatting & Pipeline Injection',
      conventionalScore: '0 / 100 (No CVE Created)',
      systemicScore: '76 / 100 (High Risk)',
      blastRadius: '4 Tier-1 Sinks Insulated'
    }
  ];

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-8 flex flex-col gap-6 overflow-y-auto select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616]/95 text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
            Attack Path Scenarios
          </h1>
          <p className="text-sm mt-3 max-w-2xl text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Simulate realistic supply chain compromises to observe contagion flow across microservices and evaluate minimal remediation cuts.
          </p>
        </div>

        <button
          onClick={onReturnToGraph}
          className="btn-3d-secondary px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer select-none shrink-0"
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Return to Topology Map</span>
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            className="connector-3d-card p-5 flex flex-col justify-between gap-4 select-none"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                  isLight ? scen.badgeColor : scen.badgeColorDark
                }`}>
                  {scen.badge}
                </span>
                <span className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  {scen.targetPackage}
                </span>
              </div>

              <h2 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                {scen.title}
              </h2>

              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {scen.description}
              </p>

              <div className={`p-3 rounded-xl border text-xs flex flex-col gap-1.5 mt-2 ${
                isLight ? 'bg-slate-50/80 border-slate-200 text-slate-700 shadow-xs' : 'bg-slate-950/80 border-slate-800 text-slate-300'
              }`}>
                <div className="flex justify-between">
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Vector:</span>
                  <span className="font-mono text-[11px] font-medium">{scen.attackVector}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Conventional CVSS:</span>
                  <span className="font-mono text-[11px]">{scen.conventionalScore}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Systemic Risk:</span>
                  <span className={`font-mono text-[11px] font-bold ${isLight ? 'text-red-700' : 'text-red-400'}`}>
                    {scen.systemicScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Estimated Blast Radius:</span>
                  <span className="font-mono text-[11px] font-semibold">{scen.blastRadius}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onLaunchScenario(scen.id)}
              className="btn-3d-primary w-full py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer select-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Attack Path</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
