import React from 'react';
import { 
  Network, 
  BarChart3, 
  ShieldAlert, 
  PlayCircle, 
  Wrench, 
  Sparkles
} from 'lucide-react';
import { NavView, KeystoneStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeView: NavView;
  onChangeView: (view: NavView) => void;
  stats: KeystoneStats;
  onOpenAskKeystone: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  stats,
  onOpenAskKeystone
}) => {
  const { isLight } = useTheme();

  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode; count?: number | string }> = [
    { id: 'ecosystem', label: 'Topology Map', icon: <Network className="w-4 h-4" /> },
    { id: 'overview', label: 'Security Posture', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'watchlist', label: 'Risk Watchlist', icon: <ShieldAlert className="w-4 h-4" />, count: '5' },
    { id: 'scenarios', label: 'Attack Scenarios', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'mitigation', label: 'Remediation', icon: <Wrench className="w-4 h-4" />, count: 'Active' }
  ];

  return (
    <aside className={`w-56 h-full border-r transition-colors duration-150 flex flex-col justify-between p-3 select-none z-20 shrink-0 ${
      isLight 
        ? 'bg-slate-50/70 border-slate-200 text-slate-800' 
        : 'bg-[#090d16] border-slate-800 text-slate-100'
    }`}>
      <div className="flex flex-col gap-4">
        {/* Navigation links */}
        <nav className="flex flex-col gap-0.5">
          <div className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Navigation
          </div>
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? isLight
                      ? 'bg-white text-slate-900 border border-slate-200/90 shadow-xs font-semibold'
                      : 'bg-slate-800 text-white font-semibold'
                    : isLight
                      ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? (isLight ? 'text-slate-900' : 'text-white') : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive 
                      ? (isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-700 text-slate-200')
                      : (isLight ? 'text-slate-400' : 'text-slate-500')
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Ask Keystone Assistant Button */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onOpenAskKeystone}
            className={`w-full py-2 px-3 rounded-md border flex items-center justify-between text-xs font-medium transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-slate-700' : 'text-cyan-400'}`} />
              <span>Ask Assistant</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
            }`}>
              NLQ
            </span>
          </button>
        </div>

        {/* Risk Concentration Card */}
        <div className={`p-3 rounded-md border flex flex-col gap-2 ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Risk Concentration</span>
            <span className="text-red-600 font-bold font-mono">{stats.sifiConcentrationRatio}%</span>
          </div>
          {/* Progress Bar */}
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
            <div 
              className="h-full bg-red-600 rounded-full"
              style={{ width: `${stats.sifiConcentrationRatio}%` }}
            />
          </div>
          <div className={`text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Top 5 dependencies account for <strong className={isLight ? 'text-slate-700' : 'text-slate-300'}>81%</strong> of total ecosystem reachability.
          </div>
        </div>
      </div>

      {/* Quick Macro Metrics Footer */}
      <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-200 dark:border-slate-800">
        <div className={`p-2 rounded border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className={`text-base font-bold font-mono ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {stats.criticalDependencies}
          </div>
          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Critical Sinks
          </div>
        </div>

        <div className={`p-2 rounded border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/40 border-slate-800'}`}>
          <div className="text-base font-bold font-mono text-red-600">
            {stats.tier1Assets}
          </div>
          <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Tier-1 Exposed
          </div>
        </div>
      </div>
    </aside>
  );
};
