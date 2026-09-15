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
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

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
        badgeColor: isLight ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-blue-950/80 text-blue-300 border-blue-800',
        dotColor: 'bg-blue-500',
        icon: ShieldCheck
      };
    }
    if (timeTravelDay < -15) {
      return {
        label: 'Pre-CVE Stealth Anomaly',
        detail: '+142% Keystone centrality surge & maintainer churn detected',
        badgeColor: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
        dotColor: 'bg-amber-500',
        icon: AlertTriangle
      };
    }
    return {
      label: timeTravelDay === 0 ? 'Day 0 CVE Disclosure' : 'Cascade Contagion Window',
      detail: 'Weaponized advisory active across 42 downstream packages',
      badgeColor: 'bg-rose-500/15 text-rose-500 border-rose-500/30',
      dotColor: 'bg-rose-500',
      icon: ShieldAlert
    };
  };

  const status = getStatus();
  const StatusIcon = status.icon;

  // Percentage for progress fill (-90 = 0%, 0 = 100%)
  const progressPercent = ((timeTravelDay - -90) / 90) * 100;

  if (isMinimized) {
    return (
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 select-none animate-in fade-in slide-in-from-bottom-2 duration-200">
        <button
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-xl text-xs font-semibold backdrop-blur-xl transition-all hover:scale-105 cursor-pointer ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-slate-200/50'
              : 'bg-slate-900/95 border-slate-800 text-slate-200 shadow-black/60'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${status.dotColor} ${isPlaying ? 'animate-ping' : ''}`} />
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono">{timeTravelDay === 0 ? 'Day 0' : `Day ${timeTravelDay}`}</span>
          <span className="text-slate-400 font-normal">| {status.label}</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-xl select-none animate-in fade-in slide-in-from-bottom-3 duration-250">
      <div className={`rounded-2xl border backdrop-blur-2xl shadow-2xl p-3 sm:p-3.5 transition-all ${
        isLight
          ? 'bg-white/95 border-slate-200/90 shadow-slate-300/40 text-slate-800'
          : 'bg-[#0a0f1d]/90 border-slate-800/90 shadow-black/80 text-slate-100'
      }`}>
        {/* Top Header: Title, Live Status Tag & Minimize */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md ${
              isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-300'
            }`}>
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight">Timeline Forensics</span>
              <span className={`hidden sm:inline text-[11px] ml-2 font-normal ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Historical Centrality Evolution & Anomaly Replay
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold transition-colors ${status.badgeColor}`}>
              <StatusIcon className="w-3 h-3" />
              <span>{status.label}</span>
              <span className="font-mono font-bold ml-0.5">
                {timeTravelDay === 0 ? 'Day 0' : `${timeTravelDay}d`}
              </span>
            </div>

            {/* Minimize toggle */}
            <button
              onClick={() => setIsMinimized(true)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                isLight ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Minimize timeline dock"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center: Controls + Slider Track + Quick Milestones */}
        <div className="flex items-center gap-3">
          {/* Play / Pause Scrubber Button */}
          <button
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause timeline replay' : 'Play timeline replay (-90d to Day 0)'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/30'
                : isLight
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Scrubber Track & Markers */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="relative flex items-center">
              {/* Background gradient track */}
              <div className={`absolute inset-y-1.5 left-0 right-0 rounded-full h-1.5 overflow-hidden pointer-events-none ${
                isLight ? 'bg-slate-200' : 'bg-slate-800'
              }`}>
                <div 
                  className="h-full transition-all duration-75 bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Native range slider overlay with customized thumb */}
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

            {/* Milestones bar with explicit SC evolution */}
            <div className="flex items-center justify-between text-[10px] font-mono">
              <button
                onClick={() => { setIsPlaying(false); onChangeTimeTravel(-90); }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  timeTravelDay === -90
                    ? isLight ? 'bg-slate-900 text-white font-bold' : 'bg-slate-700 text-white font-bold'
                    : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Jump to -90d: Baseline Clean (SC = 0.35)"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                <span>-90d Baseline</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  isLight ? 'bg-blue-50 text-blue-700' : 'bg-blue-950/60 text-blue-300'
                }`}>
                  SC=0.35
                </span>
              </button>

              <button
                onClick={() => { setIsPlaying(false); onChangeTimeTravel(-30); }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  timeTravelDay === -30
                    ? 'bg-amber-600 text-white font-bold shadow-xs'
                    : isLight ? 'text-slate-500 hover:text-amber-600' : 'text-slate-400 hover:text-amber-400'
                }`}
                title="Jump to -30d: Stealth Centrality Surge (SC = 0.71)"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 inline-block ${timeTravelDay === -30 ? 'animate-ping' : ''}`} />
                <span>-30d Anomaly</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  timeTravelDay === -30 ? 'bg-amber-700 text-white' : isLight ? 'bg-amber-50 text-amber-700' : 'bg-amber-950/60 text-amber-300'
                }`}>
                  SC=0.71
                </span>
              </button>

              <button
                onClick={() => { setIsPlaying(false); onChangeTimeTravel(0); }}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  timeTravelDay === 0
                    ? 'bg-rose-600 text-white font-bold shadow-xs'
                    : isLight ? 'text-slate-500 hover:text-rose-600' : 'text-slate-400 hover:text-rose-400'
                }`}
                title="Jump to Day 0: CVE Disclosure (SC = 0.91)"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-rose-500 inline-block ${timeTravelDay === 0 ? 'animate-ping' : ''}`} />
                <span>Day 0 CVE</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                  timeTravelDay === 0 ? 'bg-rose-700 text-white' : isLight ? 'bg-rose-50 text-rose-700' : 'bg-rose-950/60 text-rose-300'
                }`}>
                  SC=0.91
                </span>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={handleReset}
            title="Reset to Day 0"
            className={`p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isLight 
                ? 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100' 
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
