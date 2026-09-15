import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileCode, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SBOMUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: () => void;
}

interface IngestPipelineStep {
  label: string;
  detail: string;
  status: 'pending' | 'active' | 'completed';
}

export const SBOMUploadModal: React.FC<SBOMUploadModalProps> = ({
  isOpen,
  onClose,
  onIngestSuccess
}) => {
  const { isLight } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  if (!isOpen) return null;

  const PIPELINE_STEPS: IngestPipelineStep[] = [
    {
      label: 'Schema & PURL Validation',
      detail: 'Validating package-url canonical namespaces against OSV and NVD registries...',
      status: currentStepIndex > 0 ? 'completed' : currentStepIndex === 0 && isProcessing ? 'active' : 'pending'
    },
    {
      label: 'Reverse BFS Propagation & Asset Reachability',
      detail: 'Tracing 4-hop propagation cascades to Tier-1 financial sinks...',
      status: currentStepIndex > 1 ? 'completed' : currentStepIndex === 1 ? 'active' : 'pending'
    },
    {
      label: 'Tarjan Articulation Point & Cut-Vertex Solver',
      detail: 'Computing 2-connected components and minimum vertex cut...',
      status: currentStepIndex > 2 ? 'completed' : currentStepIndex === 2 ? 'active' : 'pending'
    },
    {
      label: 'Graph Ingestion & Topology Ready',
      detail: 'Successfully mapped 42 repositories and 1,489 transitive packages.',
      status: isComplete ? 'completed' : currentStepIndex === 3 ? 'active' : 'pending'
    }
  ];

  const startProcessing = (fileName: string, fileSize: string) => {
    setSelectedFile({ name: fileName, size: fileSize });
    setIsProcessing(true);
    setProgressPercent(15);
    setCurrentStepIndex(0);
    setIsComplete(false);

    setTimeout(() => {
      setProgressPercent(45);
      setCurrentStepIndex(1);
    }, 500);

    setTimeout(() => {
      setProgressPercent(78);
      setCurrentStepIndex(2);
    }, 1000);

    setTimeout(() => {
      setProgressPercent(100);
      setCurrentStepIndex(3);
      setIsComplete(true);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      startProcessing(file.name, sizeStr);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;
      startProcessing(file.name, sizeStr);
    }
  };

  const handleSelectSample = (sampleName: string, size: string) => {
    startProcessing(sampleName, size);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProgressPercent(0);
    setCurrentStepIndex(0);
    setIsComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className={`w-full max-w-xl rounded-xl border shadow-2xl flex flex-col overflow-hidden transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#080c14] border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${
              isLight ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-cyan-950/40 border-cyan-800 text-cyan-400'
            }`}>
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Ingest Repository Lockfile or CycloneDX SBOM</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                  F1 Ingest
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Upload package-lock.json, pom.xml, requirements.txt, or CycloneDX 1.5 JSON
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            aria-label="Close SBOM Ingest Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {!selectedFile ? (
            <>
              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01]'
                    : isLight
                    ? 'border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/30'
                    : 'border-slate-800 hover:border-cyan-500/80 hover:bg-cyan-950/20'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".json,.xml,.txt,.lock,.spdx"
                  className="hidden"
                />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner ${
                  isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-cyan-400'
                }`}>
                  <FileCode className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Drop lockfile or SBOM here, or click to browse</div>
                  <div className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Supports CycloneDX JSON/XML, SPDX 2.3, package-lock.json, pom.xml, requirements.txt
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 mt-1">
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">.json</span>
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">.xml</span>
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">.lock</span>
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">.txt</span>
                </div>
              </div>

              {/* Sample Profiles */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                  <span>Or load enterprise pre-validated sample profile:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSelectSample('acme-core-banking-cyclonedx.json', '284.2 KB')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-white' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs truncate">Acme Core Banking</div>
                      <div className="text-[10px] text-slate-400">CycloneDX 1.5 JSON</div>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">42 Repos • Tier-1 Sinks</div>
                  </button>

                  <button
                    onClick={() => handleSelectSample('payment-gateway-package-lock.json', '412.8 KB')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-white' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs truncate">Payment Gateway v4</div>
                      <div className="text-[10px] text-slate-400">package-lock.json</div>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">1,489 PURLs • npm</div>
                  </button>

                  <button
                    onClick={() => handleSelectSample('telemetry-pipeline-pom.xml', '168.4 KB')}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 hover:border-cyan-500 hover:bg-white' 
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs truncate">Telemetry Pipeline</div>
                      <div className="text-[10px] text-slate-400">Maven pom.xml</div>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Java/Kotlin • Articulation</div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Processing and Ingestion Status View */
            <div className="flex flex-col gap-4">
              {/* Selected File Card */}
              <div className={`p-3 rounded-lg border flex items-center justify-between ${
                isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-xs font-mono">{selectedFile.name}</div>
                    <div className="text-[10px] text-slate-400">{selectedFile.size} • Verified Ingestion Stream</div>
                  </div>
                </div>
                {!isProcessing && (
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    Change File
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span>{isComplete ? 'Ingestion Pipeline Complete' : 'Autonomous Graph Pipeline Processing...'}</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">{progressPercent}%</span>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-slate-800'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Pipeline Steps List */}
              <div className={`p-3 rounded-lg border flex flex-col gap-2.5 ${
                isLight ? 'bg-white border-slate-200' : 'bg-slate-950/60 border-slate-800'
              }`}>
                {PIPELINE_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : step.status === 'active' ? (
                        <div className="w-4 h-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-400/40 shrink-0" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-xs ${
                        step.status === 'active' ? 'text-cyan-600 dark:text-cyan-400' : ''
                      }`}>
                        {step.label}
                      </div>
                      <div className={`text-[11px] leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ingestion Results Summary */}
              {isComplete && (
                <div className={`p-3.5 rounded-lg border flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-100'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Autonomous Keystone Topology Ready</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs mt-1">
                    <div className={`p-1.5 rounded border ${isLight ? 'bg-white/80 border-emerald-200' : 'bg-emerald-950/40 border-emerald-800/60'}`}>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">42</div>
                      <div className="text-[10px] text-slate-400">Repositories</div>
                    </div>
                    <div className={`p-1.5 rounded border ${isLight ? 'bg-white/80 border-emerald-200' : 'bg-emerald-950/40 border-emerald-800/60'}`}>
                      <div className="font-mono font-bold text-slate-900 dark:text-white">1,489</div>
                      <div className="text-[10px] text-slate-400">PURLs Ingested</div>
                    </div>
                    <div className={`p-1.5 rounded border ${isLight ? 'bg-white/80 border-emerald-200' : 'bg-emerald-950/40 border-emerald-800/60'}`}>
                      <div className="font-mono font-bold text-red-600">3</div>
                      <div className="text-[10px] text-slate-400">Cut-Vertices</div>
                    </div>
                    <div className={`p-1.5 rounded border ${isLight ? 'bg-white/80 border-emerald-200' : 'bg-emerald-950/40 border-emerald-800/60'}`}>
                      <div className="font-mono font-bold text-amber-500">+142%</div>
                      <div className="text-[10px] text-slate-400">Max Surge</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <div className="text-[11px] text-slate-400">
            {isComplete ? '42 monitored repositories updated.' : 'Parses transitive dependencies in < 2 seconds.'}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                isLight ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Cancel
            </button>

            {isComplete && (
              <button
                onClick={() => {
                  onClose();
                  onIngestSuccess();
                }}
                className="px-4 py-1.5 rounded-md text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
              >
                <span>Explore Ingested Topology</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
