import React from 'react';
import { WaterfallReceipt, EcosystemNode } from '../types';
import { Layers, UserCheck, ShieldAlert, Bug } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface RiskWaterfallProps {
  receipt?: WaterfallReceipt;
  packageName?: string;
  node?: EcosystemNode;
}

export const RiskWaterfall: React.FC<RiskWaterfallProps> = ({ 
  receipt: directReceipt, 
  packageName: directPackageName,
  node 
}) => {
  const { isLight } = useTheme();

  const receipt = directReceipt || node?.waterfallReceipt;
  const packageName = directPackageName || node?.name || 'Dependency';

  if (!receipt) return null;

  return (
    <div className={`rounded-lg border p-3.5 text-xs transition-colors ${
      isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/90 border-slate-800'
    }`}>
      <div className={`flex items-center justify-between border-b pb-2 mb-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
          <span className={`font-semibold text-xs ${
            isLight ? 'text-slate-800' : 'text-slate-300'
          }`}>
            Risk Attribution Breakdown
          </span>
        </div>
        <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Topological Weights
        </div>
      </div>

      {/* Waterfall Line Items */}
      <div className="flex flex-col gap-2">
        {/* Base */}
        <div className={`flex items-center justify-between text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          <span>Base Risk Floor:</span>
          <span className="font-mono font-medium">{receipt.baseRisk} pts</span>
        </div>

        {/* 1. Centrality */}
        <div className={`p-2 rounded-md border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Network Centrality</span>
            </span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">+{receipt.centralityPts} pts</span>
          </div>
          <div className={`text-[11px] pl-5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {receipt.centralityReason}
          </div>
        </div>

        {/* 2. Fragility */}
        <div className={`p-2 rounded-md border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Maintainer Fragility (Bus Factor)</span>
            </span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">+{receipt.fragilityPts} pts</span>
          </div>
          <div className={`text-[11px] pl-5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {receipt.fragilityReason}
          </div>
        </div>

        {/* 3. Asset Exposure */}
        <div className={`p-2 rounded-md border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Downstream Asset Exposure</span>
            </span>
            <span className="font-mono font-bold text-red-600">+{receipt.assetExposurePts} pts</span>
          </div>
          <div className={`text-[11px] pl-5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {receipt.assetExposureReason}
          </div>
        </div>

        {/* 4. Exploitation Vector */}
        <div className={`p-2 rounded-md border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Bug className="w-3.5 h-3.5 text-slate-500" />
              <span>Exploitation Vector</span>
            </span>
            <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">+{receipt.exploitationPts} pts</span>
          </div>
          <div className={`text-[11px] pl-5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {receipt.exploitationReason}
          </div>
        </div>

        {/* Total Score */}
        <div className={`mt-1 pt-2 border-t flex items-center justify-between text-xs ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <span className="font-semibold">Calculated Systemic Risk:</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold font-mono text-red-600">{receipt.totalScore}</span>
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
