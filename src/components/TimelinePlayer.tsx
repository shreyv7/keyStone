import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TimelinePlayerProps {
  timeTravelDay: number;
  onChangeTimeTravel: (day: number) => void;
}

export const TimelinePlayer: React.FC<TimelinePlayerProps> = ({
  timeTravelDay,
  onChangeTimeTravel
}) => {
  const { isLight } = useTheme();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);

  // Auto-play animation (-90d -> 0d)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onChangeTimeTravel((prev) => {
        if (prev >= 0) {
          setIsPlaying(false);
          return 0;
        }
        return Math.min(0, prev + 1);
      });
    }, 70);

    return () => clearInterval(interval);
  }, [isPlaying, onChangeTimeTravel]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (timeTravelDay >= 0) {
        onChangeTimeTravel(-90);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    onChangeTimeTravel(0);
  };

  // Status computation
  const getStatus = () => {
    if (timeTravelDay <= -60) {
      return {
        label: 'Baseline Clean',
        detail: 'Normal dependency weights & clean artifact hashes',
        badgeColor: isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-950/60 text-blue-300 border-blue-800/60',
        dotColor: 'bg-blue-500',
        icon: ShieldCheck
      };
    }
    if (timeTravelDay < -15) {
      return {
        label: 'Pre-CVE Anomaly',
        detail: '+142% Keystone centrality surge & maintainer churn detected',
        badgeColor: isLight ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-amber-950/60 text-amber-300 border-amber-800/60',
        dotColor: 'bg-amber-500',
        icon: AlertTriangle
      };
    }
    return {
      label: timeTravelDay === 0 ? 'CVE Disclosure' : 'Contagion Window',
      detail: 'Weaponized advisory active across 42 downstream packages',
      badgeColor: isLight ? 'bg-red-50 text-red-700 border-red-200' : 'bg-red-950/60 text-red-400 border-red-800/60',
      dotColor: 'bg-red-500',
      icon: ShieldAlert
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Percentage for progress fill (-90 = 0%, 0 = 100%)
  const progressPercent = ((timeTravelDay - -90) / 90) * 100;

  if (isMinimized) {
    return (
      <div 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="relative select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(false);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-lg text-xs font-medium backdrop-blur-xl transition-all hover:scale-105 cursor-pointer ${
            isLight
              ? 'bg-white/95 border-slate-200/90 text-slate-800 shadow-slate-200/50'
              : 'bg-[#0a0f1d]/90 border-slate-800/80 text-slate-200 shadow-black/60'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${status.dotColor} ${isPlaying ? 'animate-ping' : ''}`} />
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-semibold">{timeTravelDay === 0 ? 'Day 0' : `Day ${timeTravelDay}`}</span>
          <span className="text-slate-400 font-normal">· {status.label}</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="relative w-full select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className={`flex items-center justify-between gap-2 sm:gap-3 px-3 py-1.5 rounded-xl border backdrop-blur-xl shadow-xl transition-all h-[38px] w-full ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-slate-200/50 text-slate-800'
          : 'bg-[#0a0f1d]/90 border-slate-800/80 shadow-black/60 text-slate-100'
      }`}>
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          title={isPlaying ? 'Pause timeline replay' : 'Play timeline replay (-90d to Day 0)'}
          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-[#2f2fe4] hover:bg-[#4343f8] text-white'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        {/* Current Day & Phase Pill */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-semibold shrink-0 whitespace-nowrap ${status.badgeColor}`}>
          <StatusIcon className="w-3 h-3 shrink-0" />
          <span className="font-mono font-bold">
            {timeTravelDay === 0 ? 'Day 0' : `${timeTravelDay}d`}
          </span>
          <span className="hidden sm:inline font-medium opacity-90">· {status.label}</span>
        </div>

        {/* Flexible Full-Width Scrubber Track */}
        <div className="relative flex items-center flex-1 min-w-[100px] px-1">
          {/* Background gradient track */}
          <div className={`absolute inset-x-1 inset-y-2 rounded-full h-1.5 overflow-hidden pointer-events-none ${
            isLight ? 'bg-slate-200' : 'bg-slate-800'
          }`}>
            <div 
              className="h-full transition-all duration-75 bg-gradient-to-r from-blue-500 via-amber-500 to-red-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <input
            type="range"
            min="-90"
            max="0"
            step="1"
            value={timeTravelDay}
            onChange={(e) => {
              setIsPlaying(false);
              onChangeTimeTravel(Number(e.target.value));
            }}
            className="relative z-10 w-full h-4 appearance-none bg-transparent cursor-pointer focus:outline-hidden"
          />
        </div>

        {/* Quick Jump Milestone Chips */}
        <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono">
          <button
            onClick={() => { setIsPlaying(false); onChangeTimeTravel(-90); }}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              timeTravelDay === -90
                ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-slate-700 text-white font-bold'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Jump to -90d: Baseline Clean"
          >
            -90d
          </button>
          <button
            onClick={() => { setIsPlaying(false); onChangeTimeTravel(-30); }}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              timeTravelDay === -30
                ? 'bg-amber-600 text-white font-bold'
                : isLight ? 'text-slate-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
            }`}
            title="Jump to -30d: Anomaly"
          >
            -30d
          </button>
          <button
            onClick={() => { setIsPlaying(false); onChangeTimeTravel(0); }}
            className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
              timeTravelDay === 0
                ? 'bg-red-600 text-white font-bold'
                : isLight ? 'text-slate-500 hover:text-red-600' : 'text-slate-400 hover:text-red-400'
            }`}
            title="Jump to Day 0: CVE"
          >
            Day 0
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleReset();
          }}
          title="Reset to Day 0"
          className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isLight 
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Minimize */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          title="Minimize timeline ribbon"
          className={`p-1 rounded-lg transition-colors cursor-pointer shrink-0 ${
            isLight 
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
