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
      description: 'Acts as a critical chokepoint connecting 21 downstream services into 4 critical services. Coordinated upgrade on internal-data-pipeline severs all propagation paths.',
      targetPackage: 'snakeyaml@1.33',
      attackVector: 'Unsafe Deserialization Gadget Chain (CVE-2022-1471)',
      conventionalScore: '48 / 100 (Moderate)',
      systemicScore: '84 / 100 (Critical)',
      blastRadius: '21 Services, 4 Critical Services'
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
      blastRadius: '14 Services, 2 Critical Services'
    },
    {
      id: 'fresh_maintainer_anomaly',
      title: 'Account Takeover: Unmaintained Library',
      badge: 'Early Warning',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      badgeColorDark: 'bg-rose-950/40 text-rose-400 border-rose-800/50',
      description: 'Sudden ownership transition on a dormant package followed by an untracked release diff. Flagged 30 days prior to CVE disclosure.',
      targetPackage: 'snakeyaml@1.33 (T-30 Days)',
      attackVector: 'Maintainer Account Transfer & Artifact Hash Mismatch',
      conventionalScore: '0 / 100 (No Public Advisory)',
      systemicScore: '79 / 100 (High Risk)',
      blastRadius: 'Early Warning Signal'
    },
    {
      id: 'dep_confusion',
      title: 'Namespace Squatting: Dependency Confusion',
      badge: 'Registry Defense Active',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      badgeColorDark: 'bg-purple-950/60 text-purple-300 border-purple-800',
      description: 'Public package published using an internal corporate namespace. Registry scope pinning prevents unauthorized upstream dependency override.',
      targetPackage: 'internal-data-pipeline',
      attackVector: 'Public Registry PURL Namespace Squatting & Pipeline Injection',
      conventionalScore: '0 / 100 (No CVE Created)',
      systemicScore: '76 / 100 (High Risk)',
      blastRadius: '4 Critical Services Protected'
    }
  ];

  return (
    <div className={`absolute inset-0 z-20 backdrop-blur-md p-8 flex flex-col gap-6 overflow-y-auto select-none ${
      isLight ? 'bg-white text-slate-900' : 'bg-[#080616]/95 text-slate-100'
    }`}>
      {/* Header */}
      <div className={`flex items-start justify-between border-b pb-5 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            Attack Path Scenarios
          </h1>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Simulate dependency compromise scenarios to observe propagation paths and evaluate targeted remediations.
          </p>
        </div>

        <button
          onClick={onReturnToGraph}
          className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors flex items-center gap-2 border ${
            isLight 
              ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Return to Topology Map</span>
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scen) => (
          <div
            key={scen.id}
            className={`p-5 rounded-lg border flex flex-col justify-between gap-4 transition-all ${
              isLight 
                ? 'bg-white border-slate-200 shadow-xs hover:border-slate-300' 
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
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

              <h2 className={`text-base font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {scen.title}
              </h2>

              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                {scen.description}
              </p>

              <div className={`p-3 rounded-md border text-xs flex flex-col gap-1.5 mt-2 ${
                isLight ? 'bg-white border-slate-200 text-slate-700 shadow-xs' : 'bg-slate-950/80 border-slate-800 text-slate-300'
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
              className={`w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                isLight 
                  ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                  : 'bg-slate-100 hover:bg-white text-slate-900'
              }`}
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
