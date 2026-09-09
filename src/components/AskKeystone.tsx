import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Search,
  Code2
} from 'lucide-react';
import { PRE_SEEDED_QUESTIONS, DETERMINISTIC_ANSWERS } from '../data/mockEcosystem';
import { useTheme } from '../context/ThemeContext';

interface AskKeystoneProps {
  isOpen: boolean;
  onClose: () => void;
  onHighlightNodes: (nodeIds: string[]) => void;
}

export const AskKeystone: React.FC<AskKeystoneProps> = ({
  isOpen,
  onClose,
  onHighlightNodes
}) => {
  const { isLight } = useTheme();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('q1');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeAnswerKey, setActiveAnswerKey] = useState<string>('q1');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentAnswer = DETERMINISTIC_ANSWERS[activeAnswerKey] || DETERMINISTIC_ANSWERS['q1'];

  const handleAsk = (key: string) => {
    setIsTyping(true);
    setActiveAnswerKey(key);
    setTimeout(() => {
      setIsTyping(false);
      const ans = DETERMINISTIC_ANSWERS[key];
      if (ans && ans.highlightNodes) {
        onHighlightNodes(ans.highlightNodes);
      }
    }, 300);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const lower = customInput.toLowerCase();
    let matchKey = 'q1';
    if (lower.includes('critical') || lower.includes('biggest') || lower.includes('worst')) {
      matchKey = 'q2';
    } else if (lower.includes('why') || lower.includes('keystone') || lower.includes('paradox')) {
      matchKey = 'q3';
    } else if (lower.includes('intervention') || lower.includes('fix') || lower.includes('mitigate') || lower.includes('path')) {
      matchKey = 'q4';
    } else {
      matchKey = 'q1';
    }
    handleAsk(matchKey);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className={`w-full max-w-2xl rounded-xl border shadow-xl flex flex-col overflow-hidden ${
        isLight 
          ? 'bg-white border-slate-200 text-slate-900' 
          : 'bg-[#090d16] border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
              isLight ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-100 border border-slate-700'
            }`}>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold flex items-center gap-2">
                <span>Security Assistant</span>
                <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                  isLight 
                    ? 'bg-slate-100 text-slate-700 border-slate-200' 
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  Topology Engine
                </span>
              </div>
              <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Natural-language query interface for dependency graph analysis
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1 rounded-md transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Verification Bar */}
        <div className={`px-4 py-2 border-b flex items-center justify-between text-xs ${
          isLight 
            ? 'bg-slate-50 border-slate-200 text-slate-600' 
            : 'bg-slate-900/90 border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="font-medium text-[11px]">Ecosystem Model: Verified Against 42 Repositories</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Code2 className="w-3 h-3" />
            <span className="font-mono text-[10px]">{currentAnswer.functionCalled}</span>
          </div>
        </div>

        {/* Suggested Queries Chips */}
        <div className={`p-4 border-b ${
          isLight ? 'bg-slate-50/40 border-slate-200' : 'bg-slate-950/40 border-slate-800'
        }`}>
          <div className={`text-[11px] uppercase font-semibold mb-2 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Suggested Inquiries:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRE_SEEDED_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => {
                  setSelectedQuestionId(q.id);
                  handleAsk(q.id);
                }}
                className={`text-left text-xs px-2.5 py-1.5 rounded-md border transition-all ${
                  activeAnswerKey === q.id
                    ? isLight
                      ? 'bg-slate-900 text-white border-slate-900 font-medium'
                      : 'bg-slate-100 text-slate-900 border-slate-100 font-medium'
                    : isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                {q.shortLabel || q.query}
              </button>
            ))}
          </div>
        </div>

        {/* Answer Output Area */}
        <div className="p-5 flex-1 overflow-y-auto max-h-80 flex flex-col gap-3">
          {isTyping ? (
            <div className={`flex items-center gap-2 text-xs font-mono py-8 justify-center ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-2">Traversing graph topology...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className={`text-xs uppercase font-semibold tracking-wider ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Analysis Result:
              </div>

              {/* Verified Facts summary */}
              {currentAnswer.deterministicFacts && (
                <div className={`p-3 rounded-md border text-xs flex flex-col gap-1.5 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}>
                  <div className={`text-[10px] font-semibold uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    Topological Evidence:
                  </div>
                  {currentAnswer.deterministicFacts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="leading-snug">{fact}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Natural Language Synthesis */}
              <div className={`p-4 rounded-md border text-xs leading-relaxed ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-200'
              }`}>
                {currentAnswer.narrative}
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleCustomSubmit} className={`p-3 border-t flex items-center gap-2 ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
        }`}>
          <input
            type="text"
            placeholder="Ask anything about dependencies, reachability, or mitigation..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className={`flex-1 border rounded-md px-3 py-2 text-xs outline-none transition-colors ${
              isLight 
                ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-500' 
                : 'bg-slate-900 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-slate-500'
            }`}
          />
          <button
            type="submit"
            className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isLight 
                ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                : 'bg-slate-100 hover:bg-white text-slate-900'
            }`}
          >
            <span>Query</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>
    </div>
  );
};
