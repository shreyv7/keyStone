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
  Rocket,
  Flame
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
        { id: 'overview', label: 'Security Posture', icon: <BarChart3 className="w-3.5 h-3.5" /> },
        { id: 'ecosystem', label: 'Topology Map', icon: <Network className="w-3.5 h-3.5" /> },
        { id: 'watchlist', label: 'Risk Watchlist', icon: <ShieldAlert className="w-3.5 h-3.5" />, count: '5' },
        { id: 'blast-radius', label: 'Blast Radius', icon: <Flame className="w-3.5 h-3.5" /> },
        { id: 'mitigation', label: 'Remediation', icon: <Wrench className="w-3.5 h-3.5" /> }
      ]
    },
    {
      label: 'OPERATIONS',
      items: [
        { id: 'rollout', label: 'Rollout Cockpit', icon: <Rocket className="w-3.5 h-3.5" /> },
        { id: 'connectors', label: 'Connectors', icon: <GitBranch className="w-3.5 h-3.5" /> },
        { id: 'hardware', label: 'Scanner Agents', icon: <Server className="w-3.5 h-3.5" /> }
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
    <aside className={`${isCollapsed ? 'w-14 p-2' : 'w-52 lg:w-56 p-2.5'} h-full border-r ${isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0a0f1d] border-slate-800 text-slate-100'} transition-all duration-200 flex flex-col select-none z-20 shrink-0 overflow-hidden`}>
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2.5 pr-0.5">
        {/* Grouped & Collapsible Navigation Links */}
        <nav className="flex flex-col gap-2">
          {navGroups.map(group => {
            const isSectionCollapsed = !!collapsedSections[group.label];
            return (
              <div key={group.label} className="flex flex-col gap-0.5">
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection(group.label)}
                    className={`w-full flex items-center justify-between px-2.5 pt-1.5 pb-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer group select-none ${
                      isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-blue-400'
                    }`}
                    title={`${isSectionCollapsed ? 'Expand' : 'Collapse'} ${group.label}`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSectionCollapsed ? '-rotate-90 text-slate-500' : isLight ? 'rotate-0 text-slate-500' : 'rotate-0 text-slate-400'}`} />
                  </button>
                ) : (
                  <div className={`w-full h-px my-1 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                )}

                {(!isSectionCollapsed || isCollapsed) && group.items.map(item => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onChangeView(item.id)}
                      title={item.label}
                      className={`group flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between px-3 py-1.5'} rounded-lg text-xs font-medium transition-colors cursor-pointer select-none mb-0.5 ${
                        isActive
                          ? 'bg-[#2f2fe4] text-white shadow-xs'
                          : isLight
                            ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:shadow-xs'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-white' : isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <span className="text-xs">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && item.count && (
                        <span className={`text-[10px] font-mono font-medium px-1.5 py-0.2 rounded ${
                          isActive 
                            ? 'bg-blue-700 text-blue-100'
                            : isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
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
            className={`w-full ${isCollapsed ? 'p-2 justify-center' : 'py-1.5 px-3 justify-start'} rounded-lg border flex items-center gap-2 text-xs font-medium transition-colors cursor-pointer mb-0.5 ${
              isLight
                ? 'border-slate-300 bg-white text-slate-700 shadow-xs hover:bg-slate-100 hover:text-slate-950'
                : 'border-slate-700/60 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {!isCollapsed && <span className="text-xs">Ask Assistant</span>}
          </button>
        </div>
      </div>

    </aside>
  );
};
