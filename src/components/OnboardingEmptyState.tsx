import React from 'react';
import { 
  ShieldAlert, 
  UploadCloud, 
  Sparkles, 
  Network, 
  Zap, 
  DollarSign, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OnboardingEmptyStateProps {
  onOpenSBOMModal?: () => void;
  onLoadDemoData?: () => void;
  title?: string;
  description?: string;
  compact?: boolean;
}

export const OnboardingEmptyState: React.FC<OnboardingEmptyStateProps> = ({
  onOpenSBOMModal,
  onLoadDemoData,
  title = 'No Dependency Repositories Ingested Yet',
  description = 'Connect your enterprise code repositories or upload CycloneDX/SPDX SBOMs and lockfiles to construct your live systemic risk graph.',
  compact = false
}) => {
  const { isLight } = useTheme();

  return (
    <div className={`w-full rounded-2xl border flex flex-col items-center justify-center p-8 sm:p-12 text-center transition-all select-none ${
      isLight 
        ? 'bg-gradient-to-b from-slate-50 to-white border-slate-200 shadow-sm text-slate-900' 
        : 'bg-gradient-to-b from-[#090d16] to-[#04060a] border-slate-800 text-slate-100'
    }`}>
      {/* Visual Radar / Sensor Icon */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center relative z-10 bg-cyan-500/10 border border-cyan-500/30 text-cyan-500">
          <Network className="w-10 h-10 animate-pulse" />
        </div>
        {/* Animated concentric radar rings */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" />
        <div className="absolute -inset-3 rounded-full border border-cyan-500/10" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="max-w-xl mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2.5">
          {title}
        </h2>
        <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          {description}
        </p>
      </div>

      {/* Primary Action CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-10">
        {onOpenSBOMModal && (
          <button
            onClick={onOpenSBOMModal}
            className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center gap-2.5 shadow-md hover:shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest SBOM or Lockfile</span>
          </button>
        )}

        {onLoadDemoData && (
          <button
            onClick={onLoadDemoData}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold border flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              isLight 
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Load Acme Enterprise Demo Portfolio</span>
          </button>
        )}
      </div>

      {/* Feature Pillar Highlights */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl text-left border-t pt-8 border-slate-200 dark:border-slate-800/80">
          {/* Card 1 */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="p-2 w-fit rounded-lg bg-red-500/10 text-red-500 mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
              High-impact dependencies
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Identifies single points of failure and targeted remediations that sever contagion paths with zero breaking API changes.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-500 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
              Early Anomaly Detection
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Surfaces maintainer churn and dependency velocity anomalies before public advisory disclosure.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`p-4 rounded-xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500 mb-3">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1">
              Financial Risk Quantification
            </h4>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Maps technical dependencies directly to transaction exposure and regulatory compliance requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
