import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User, 
  Calendar,
  Layers,
  Terminal,
  Briefcase,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { RoleLens } from '../types';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  activeLens: RoleLens;
  onChangeLens: (lens: RoleLens) => void;
  timeTravelDay: number;
  onChangeTimeTravel: (day: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectSearchResult: (nodeId: string) => void;
  searchResults: Array<{ id: string; name: string; version: string; structuralRisk: string }>;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeLens,
  onChangeLens,
  timeTravelDay,
  onChangeTimeTravel,
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
  searchResults
}) => {
  const { toggleTheme, isLight } = useTheme();

  return (
    <header className={`h-14 w-full border-b transition-colors duration-150 px-5 flex items-center justify-between z-30 shrink-0 select-none ${
      isLight 
        ? 'bg-white border-slate-200 text-slate-800' 
        : 'bg-[#090d16] border-slate-800 text-slate-100'
    }`}>
      {/* Brand & Portfolio Meta */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
            isLight ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-bold tracking-tight text-sm ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              KEYSTONE
            </span>
            <span className={`text-[11px] hidden sm:inline ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Supply Chain Security
            </span>
          </div>
        </div>

        <div className={`h-4 w-px hidden md:block ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        {/* Portfolio & Environment Selector */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <span className={isLight ? 'text-slate-400' : 'text-slate-500'}>Scope:</span>
            <span className={`font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>Production Core</span>
            <ChevronDown className={`w-3 h-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
            isLight 
              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800' 
              : 'bg-emerald-950/30 border-emerald-800/40 text-emerald-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-medium">42 Repositories Monitored</span>
          </div>
        </div>
      </div>

      {/* Center: Role-Based Perspective */}
      <div className="hidden xl:flex items-center gap-4">
        {/* Role Lens Segmented Toggle */}
        <div className={`flex items-center p-0.5 border rounded-lg text-xs ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            onClick={() => onChangeLens('ciso')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeLens === 'ciso'
                ? isLight ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'bg-slate-800 text-white font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Executive</span>
          </button>
          <button
            onClick={() => onChangeLens('developer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeLens === 'developer'
                ? isLight ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'bg-slate-800 text-white font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AppSec</span>
          </button>
          <button
            onClick={() => onChangeLens('maintainer')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              activeLens === 'maintainer'
                ? isLight ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'bg-slate-800 text-white font-semibold'
                : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Engineering</span>
          </button>
        </div>

        {/* Timeline Forensics */}
        <div className={`flex items-center gap-2 border px-2.5 py-1 rounded-lg text-xs ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Timeline:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChangeTimeTravel(-90)}
              className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                timeTravelDay === -90
                  ? isLight ? 'bg-slate-900 text-white font-medium' : 'bg-slate-700 text-white font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              -90d
            </button>
            <button
              onClick={() => onChangeTimeTravel(-30)}
              className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                timeTravelDay === -30
                  ? isLight ? 'bg-amber-600 text-white font-medium' : 'bg-amber-600 text-white font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              -30d (Anomaly)
            </button>
            <button
              onClick={() => onChangeTimeTravel(0)}
              className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                timeTravelDay === 0
                  ? isLight ? 'bg-slate-900 text-white font-medium' : 'bg-slate-700 text-white font-medium'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Present
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls: Search, Theme Toggle & Meta */}
      <div className="flex items-center gap-2.5">
        {/* Search */}
        <div className="relative w-44 md:w-56">
          <div className={`flex items-center gap-2 border rounded-md px-2.5 py-1 text-xs transition-all ${
            isLight 
              ? 'bg-slate-50 border-slate-200 text-slate-800 focus-within:border-slate-400 focus-within:bg-white' 
              : 'bg-slate-900 border-slate-800 text-slate-300 focus-within:border-slate-600'
          }`}>
            <Search className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search dependencies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`bg-transparent border-none outline-none w-full text-xs ${
                isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-slate-100 placeholder:text-slate-500'
              }`}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {searchQuery.trim().length > 0 && searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-md shadow-lg py-1 z-50 max-h-60 overflow-y-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectSearchResult(item.id)}
                  className={`px-3 py-1.5 cursor-pointer flex items-center justify-between text-xs transition-colors ${
                    isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-medium text-xs">{item.name}</span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>v{item.version}</span>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                      item.structuralRisk === 'critical'
                        ? isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/40 text-red-400 border border-red-800/50'
                        : item.structuralRisk === 'high'
                        ? isLight ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-amber-950/40 text-amber-400 border border-amber-800/50'
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.structuralRisk}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          className={`p-1.5 rounded-md border transition-all flex items-center gap-1.5 text-xs ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          {isLight ? (
            <Moon className="w-3.5 h-3.5 text-slate-700" />
          ) : (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          )}
        </button>

        {/* User Profile */}
        <div className={`flex items-center gap-2 border-l pl-2.5 ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-medium ${
            isLight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}>
            <User className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
