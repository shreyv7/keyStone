import React, { useState, useMemo } from 'react';
import { EcosystemNode, KeystoneStats, RoleLens } from '../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FileCode, 
  Table, 
  ShieldAlert, 
  FileSpreadsheet 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { 
  generateMarkdownReport, 
  generateJsonReport, 
  generateCsvReport, 
  downloadFile 
} from '../utils/exportUtils';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: EcosystemNode[];
  stats: KeystoneStats;
  activeLens?: RoleLens;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  stats,
  activeLens = 'ciso'
}) => {
  const { isLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'markdown' | 'json' | 'csv'>('markdown');
  const [copied, setCopied] = useState(false);

  // Memoize generated report contents
  const markdownContent = useMemo(
    () => generateMarkdownReport(nodes, stats, (activeLens || 'ciso') as RoleLens),
    [nodes, stats, activeLens]
  );

  const jsonContent = useMemo(
    () => generateJsonReport(nodes, stats),
    [nodes, stats]
  );

  const csvContent = useMemo(
    () => generateCsvReport(nodes),
    [nodes]
  );

  const currentContent = useMemo(() => {
    switch (activeTab) {
      case 'json':
        return jsonContent;
      case 'csv':
        return csvContent;
      case 'markdown':
      default:
        return markdownContent;
    }
  }, [activeTab, markdownContent, jsonContent, csvContent]);

  const currentFileConfig = useMemo(() => {
    const date = new Date().toISOString().split('T')[0];
    switch (activeTab) {
      case 'json':
        return {
          filename: `keystone-graph-telemetry-${date}.json`,
          mimeType: 'application/json',
          label: 'JSON Telemetry'
        };
      case 'csv':
        return {
          filename: `keystone-risk-register-${date}.csv`,
          mimeType: 'text/csv',
          label: 'CSV Risk Register'
        };
      case 'markdown':
      default:
        return {
          filename: `keystone-audit-briefing-${date}.md`,
          mimeType: 'text/markdown',
          label: 'Markdown Audit Briefing'
        };
    }
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(currentContent, currentFileConfig.filename, currentFileConfig.mimeType);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className={`w-full max-w-3xl rounded-xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#090d16] border-slate-800 text-slate-100'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Export Systemic Risk Report"
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-900/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isLight ? 'bg-blue-50 text-blue-600' : 'bg-blue-950/40 text-blue-400'
            }`}>
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Export Systemic Risk & Audit Report</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium border ${
                  isLight ? 'bg-slate-100 text-slate-600 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Audit Export
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Export portfolio graph telemetry, executive DORA/PCI compliance summaries, or tabular risk registers.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close export dialog"
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isLight 
                ? 'border-slate-200 hover:bg-slate-100 text-slate-500' 
                : 'border-slate-800 hover:bg-slate-800 text-slate-400'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className={`px-5 py-3 border-b flex items-center justify-between gap-3 shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-100/50' : 'border-slate-800/60 bg-slate-900/20'
        }`}>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'markdown'
                  ? isLight
                    ? 'bg-white text-cyan-700 shadow-xs font-semibold'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Executive Briefing (.md)</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'json'
                  ? isLight
                    ? 'bg-white text-cyan-700 shadow-xs font-semibold'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Graph Telemetry (.json)</span>
            </button>

            <button
              onClick={() => setActiveTab('csv')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'csv'
                  ? isLight
                    ? 'bg-white text-cyan-700 shadow-xs font-semibold'
                    : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/80 font-semibold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Risk Register (.csv)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentContent.split('\n').length} lines • {(currentContent.length / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>

        {/* Live Content Preview */}
        <div className="flex-1 p-5 overflow-y-auto min-h-[300px] max-h-[460px]">
          <div className={`p-4 rounded-lg font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre border ${
            isLight 
              ? 'bg-white border-slate-200 text-slate-800 shadow-xs' 
              : 'bg-[#04060a] border-slate-800 text-slate-300'
          }`}>
            {currentContent}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800/80 bg-slate-900/40'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-500" />
            <span>Cryptographically verifiable SIFI audit artifact</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-md text-xs font-medium border flex items-center gap-2 transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Preview'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentFileConfig.label}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
