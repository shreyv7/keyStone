import React, { useState } from 'react';
import { 
  Network, 
  BarChart3, 
  ShieldAlert, 
  PlayCircle, 
  Wrench, 
  Sparkles,
  GitBranch,
  Server,
  Building2,
  Key,
  Sliders,
  ChevronDown,
  Rocket
} from 'lucide-react';
import { NavView, KeystoneStats } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeView: NavView;
  onChangeView: (view: NavView) => void;
  stats: KeystoneStats;
  onOpenAskKeystone: () => void;
  onOpenSBOMModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavGroup {
  label: string;
  items: Array<{
    id: NavView;
    label: string;
    icon: React.ReactNode;
    count?: number | string;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onChangeView,
  stats,
  onOpenAskKeystone,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const { isLight } = useTheme();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (label: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const navGroups: NavGroup[] = [
    {
      label: 'ANALYSIS',
      items: [
        { id: 'ecosystem', label: 'Topology Map', icon: <Network className="w-3.5 h-3.5" /> },
        { id: 'overview', label: 'Security Posture', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        { id: 'watchlist', label: 'Risk Watchlist', icon: <ShieldAlert className="w-3.5 h-3.5" />, count: '5' },
        { id: 'mitigation', label: 'Remediation', icon: <Wrench className="w-3.5 h-3.5" />, count: 'Active' }
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'rollout', label: 'Rollout Cockpit', icon: <Rocket className="w-3.5 h-3.5" />, count: 'Gate' },
        { id: 'connectors', label: 'Connectors', icon: <GitBranch className="w-3.5 h-3.5" />, count: '6' },
        { id: 'hardware', label: 'Scanner Agents', icon: <Server className="w-3.5 h-3.5" />, count: '3' }
      ]
    },
    {
      label: 'WORKSPACE',
      items: [
        { id: 'organization', label: 'Organization', icon: <Building2 className="w-3.5 h-3.5" /> },
        { id: 'api-keys', label: 'API Keys', icon: <Key className="w-3.5 h-3.5" /> },
        { id: 'settings', label: 'Settings', icon: <Sliders className="w-3.5 h-3.5" /> }
      ]
    }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-14 p-2' : 'w-52 lg:w-56 p-2.5'} h-full border-r ks-border bg-slate-950/95 text-slate-100 transition-all duration-200 flex flex-col justify-between select-none z-20 shrink-0 overflow-y-auto`}>
      <div className="flex flex-col gap-2.5">
        {/* Grouped & Collapsible Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navGroups.map(group => {
            const isSectionCollapsed = !!collapsedSections[group.label];
            return (
              <div key={group.label} className="flex flex-col gap-0.5">
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection(group.label)}
                    className="w-full flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400 hover:text-blue-400 transition-colors cursor-pointer group select-none"
                    title={`${isSectionCollapsed ? 'Expand' : 'Collapse'} ${group.label}`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSectionCollapsed ? '-rotate-90 text-slate-500' : 'rotate-0 text-slate-400'}`} />
                  </button>
                ) : (
                  <div className="w-full h-px bg-slate-800 my-1" />
                )}

                {(!isSectionCollapsed || isCollapsed) && group.items.map(item => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChangeView(item.id)}
                      title={item.label}
                      className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-1.5'} rounded-lg text-xs font-semibold transition-all cursor-pointer select-none mb-0.5 ${
                        isActive
                          ? 'ks-nav-item-active'
                          : 'ks-nav-item'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform duration-150 ${isActive ? 'text-white scale-105' : 'text-slate-400'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="tracking-tight text-xs">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && item.count && (
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isActive 
                            ? 'bg-blue-900 text-blue-100 border border-blue-400/30'
                            : 'bg-slate-800/90 text-slate-300 border border-slate-700/60'
                        }`}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Ask Keystone Assistant Button */}
        <div className="pt-0.5">
          <button
            onClick={onOpenAskKeystone}
            title="Ask Assistant (Natural Language Supply Chain Queries)"
            className={`w-full ${isCollapsed ? 'p-2 justify-center' : 'py-1.5 px-3 justify-start'} rounded-lg ks-nav-item border border-blue-500/20 bg-blue-950/30 hover:bg-blue-900/40 text-blue-200 flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer mb-0.5`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {!isCollapsed && <span className="text-xs">Ask Assistant</span>}
          </button>
        </div>
      </div>

      {/* Bottom Section: Macro Metrics and Risk Concentration */}
      <div className="flex flex-col gap-2 pt-2 border-t ks-border">
        {/* Quick Macro Metrics: Critical Sinks & Tier-1 Exposed */}
        {isCollapsed ? (
          <div 
            className="flex flex-col items-center gap-0.5 text-center"
            title={`${stats.criticalDependencies} Critical Sinks • ${stats.tier1Assets} Tier-1 Exposed`}
          >
            <span className="text-[10px] font-mono font-bold text-rose-400">{stats.tier1Assets}T1</span>
            <span className="text-[9px] text-slate-400">{stats.criticalDependencies}S</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 text-center">
            <div className="p-2 rounded-lg ks-card">
              <div className="text-base font-bold font-mono text-slate-100">
                {stats.criticalDependencies}
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                Critical Sinks
              </div>
            </div>

            <div className="p-2 rounded-lg ks-card">
              <div className="text-base font-bold font-mono text-rose-400">
                {stats.tier1Assets}
              </div>
              <div className="text-[10px] font-medium text-slate-400 mt-0.5">
                Tier-1 Exposed
              </div>
            </div>
          </div>
        )}

        {/* Risk Concentration Card */}
        {isCollapsed ? (
          <div 
            className="p-2 rounded-xl ks-card flex flex-col items-center justify-center gap-1"
            title={`Risk Concentration: ${stats.sifiConcentrationRatio}% SIFI (Top 5 dependencies)`}
          >
            <span className="text-xs text-rose-400 font-bold font-mono">{stats.sifiConcentrationRatio}%</span>
            <div className="w-5 h-1 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
          </div>
        ) : (
          <div className="p-3 rounded-xl ks-card flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Risk Concentration</span>
              <span className="text-rose-400 font-bold font-mono">{stats.sifiConcentrationRatio}%</span>
            </div>
            {/* Recessed Progress Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden bg-slate-950 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-rose-600 to-rose-500 rounded-full"
                style={{ width: `${stats.sifiConcentrationRatio}%` }}
              />
            </div>
            <div className="text-xs leading-relaxed text-slate-400">
              Top 5 dependencies account for <strong className="text-slate-200 font-semibold">81%</strong> of total reachability.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
