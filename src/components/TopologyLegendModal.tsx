import React from 'react';
import { X, HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface TopologyLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopologyLegendModal: React.FC<TopologyLegendModalProps> = ({ isOpen, onClose }) => {
  const { isLight } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className={`w-full max-w-lg rounded-xl border shadow-xl p-5 flex flex-col gap-4 ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900' 
          : 'bg-[#090d16] border-slate-800 text-slate-100'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <h3 className="font-semibold text-sm">
              Topology Visualization Legend
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-xs">
          {/* Node Types */}
          <div className="flex flex-col gap-2">
            <span className={`text-[11px] font-semibold uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Node Classifications & Geometry:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-2.5 rounded-md border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className="w-3 h-3 rounded-full bg-red-600 shrink-0"></span>
                <div>
                  <div className="font-semibold">Structural Keystone</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Cut-vertex with halo</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-md border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
                <div>
                  <div className="font-semibold">Tier-1 Production Sink</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Crown jewel asset</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-md border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                <div>
                  <div className="font-semibold">Application Service</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Layer 4 consumer</div>
                </div>
              </div>

              <div className={`p-2.5 rounded-md border flex items-center gap-2.5 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0"></span>
                <div>
                  <div className="font-semibold">Open-Source Library</div>
                  <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Layer 1 transitive base</div>
                </div>
              </div>
            </div>
          </div>

          {/* Edges */}
          <div className="flex flex-col gap-2">
            <span className={`text-[11px] font-semibold uppercase ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Dependency Links:
            </span>
            <div className={`flex flex-col gap-2 p-3 rounded-md border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-0.5 bg-red-600 shrink-0"></span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                  Active Attack Path: <strong className="text-red-600">Dynamic Contagion Chain</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-0.5 bg-emerald-600 shrink-0"></span>
                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>
                  Severed Link: <strong className="text-emerald-600">Minimum-Cut Target</strong>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`w-4 h-0.5 ${isLight ? 'bg-slate-400' : 'bg-slate-600'} shrink-0`}></span>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                  Standard Dependency: Pinned version link
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2 rounded-md text-xs font-semibold transition-colors mt-1 ${
            isLight 
              ? 'bg-slate-900 hover:bg-slate-800 text-white' 
              : 'bg-slate-100 hover:bg-white text-slate-900'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};
