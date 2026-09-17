import React from 'react';
import { EcosystemNode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { GitBranch, ShieldAlert, CheckCircle2, AlertTriangle, ArrowDown, ExternalLink } from 'lucide-react';

interface SSVCDecisionTreeProps {
  node: EcosystemNode;
  className?: string;
}

export const SSVCDecisionTree: React.FC<SSVCDecisionTreeProps> = ({ node, className = '' }) => {
  const { isLight } = useTheme();

  // Determine SSVC attributes based on node
  const verdict = node.ssvcVerdict || (
    node.systemicScore >= 80 ? 'IMMEDIATE' :
    node.systemicScore >= 65 ? 'OUT_OF_CYCLE' :
    node.systemicScore >= 45 ? 'SCHEDULED' : 'DEFER'
  );

  const exploitation = (node.exploitationPts || 0) >= 8 || node.systemicScore >= 80 ? 'ACTIVE (KEV/Wild)' :
    (node.exploitationPts || 0) >= 4 ? 'PoC PUBLIC' : 'NONE DETECTED';

  const automatable = node.category === 'open-source' && node.systemicScore >= 70 ? 'YES' : 'NO';

  const technicalImpact = node.tier1Reach >= 3 || node.reachabilityStatus === 'REACHABLE' ? 'TOTAL' : 'PARTIAL';

  const systemExposure = node.layer <= 2 ? 'OPEN' : node.layer <= 4 ? 'CONTROLLED' : 'RESTRICTED';

  const missionImpact = node.systemicScore >= 80 ? 'MEF FAILURE' :
    node.systemicScore >= 60 ? 'DEGRADED' : 'MINIMAL';

  const getVerdictBadge = () => {
    switch (verdict) {
      case 'IMMEDIATE':
        return {
          bg: isLight ? 'bg-red-600 text-white' : 'bg-red-500 text-black font-bold',
          sla: '24 Hours (Immediate Out-of-Band Mitigation)',
          desc: 'High systemic contagion with confirmed active weaponization.',
          icon: ShieldAlert
        };
      case 'OUT_OF_CYCLE':
        return {
          bg: isLight ? 'bg-orange-600 text-white' : 'bg-orange-500 text-black font-bold',
          sla: '7 Days (Next Expedited Patch Window)',
          desc: 'Exploitable path with critical component reach.',
          icon: AlertTriangle
        };
      case 'SCHEDULED':
        return {
          bg: isLight ? 'bg-amber-600 text-white' : 'bg-amber-400 text-black font-bold',
          sla: '30 Days (Standard Sprint Cycle)',
          desc: 'Manageable blast radius; non-automated exploitation.',
          icon: GitBranch
        };
      case 'DEFER':
      default:
        return {
          bg: isLight ? 'bg-emerald-600 text-white' : 'bg-emerald-400 text-black font-bold',
          sla: 'Indefinite (Compensating Controls Active)',
          desc: 'Dead code or isolated channel; formal VEX suppression.',
          icon: CheckCircle2
        };
    }
  };

  const badgeInfo = getVerdictBadge();
  const IconComponent = badgeInfo.icon;

  const decisionSteps = [
    {
      title: 'Exploitation State',
      value: exploitation,
      active: true,
      reason: exploitation.includes('ACTIVE') ? 'CISA KEV / Ingested OSV active signature' : 'No weaponized exploit observed'
    },
    {
      title: 'Automatable Vector',
      value: automatable,
      active: automatable === 'YES',
      reason: automatable === 'YES' ? 'Network unauthenticated remote execution' : 'Requires human interaction'
    },
    {
      title: 'Technical Impact',
      value: technicalImpact,
      active: technicalImpact === 'TOTAL',
      reason: technicalImpact === 'TOTAL' ? 'Total control over runtime memory or host context' : 'Limited privilege escalation'
    },
    {
      title: 'System Exposure',
      value: systemExposure,
      active: systemExposure === 'OPEN',
      reason: systemExposure === 'OPEN' ? 'Public ingress / open network transit channel' : 'Internal mesh / private VPC'
    },
    {
      title: 'Mission & Asset Impact',
      value: missionImpact,
      active: missionImpact === 'MEF FAILURE',
      reason: `${node.tier1Reach} critical production services at risk`
    }
  ];

  return (
    <div className={`p-4 rounded-xl border flex flex-col gap-3.5 transition-all ${
      isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
    } ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isLight ? 'bg-indigo-50 text-indigo-700' : 'bg-indigo-950/60 text-indigo-400'}`}>
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                SSVC Decision Tree
              </span>
            </div>
            <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              CISA SSVC Triage Framework
            </p>
          </div>
        </div>

        <a
          href="https://www.cisa.gov/stakeholder-specific-vulnerability-categorization-ssvc"
          target="_blank"
          rel="noreferrer"
          className={`text-[10px] flex items-center gap-0.5 transition-colors ${
            isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Spec</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Decision Tree Steps */}
      <div className="flex flex-col gap-1.5">
        {decisionSteps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs transition-all ${
              step.active
                ? isLight ? 'bg-amber-50/70 border-amber-300/80 shadow-xs' : 'bg-amber-950/20 border-amber-800/60'
                : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800/80'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                  step.active
                    ? isLight ? 'bg-amber-600 text-white' : 'bg-amber-500 text-slate-950'
                    : isLight ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-slate-400'
                }`}>
                  {idx + 1}
                </span>
                <div>
                  <div className={`font-semibold text-[11px] ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                    {step.title}
                  </div>
                  <div className={`text-[9px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {step.reason}
                  </div>
                </div>
              </div>

              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                step.active
                  ? isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-700'
                  : isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {step.value}
              </span>
            </div>

            {idx < decisionSteps.length - 1 && (
              <div className="flex justify-center -my-1 text-slate-400">
                <ArrowDown className="w-3 h-3 opacity-60" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Final Verdict Banner */}
      <div className={`p-3 rounded-lg flex items-center justify-between gap-3 ${badgeInfo.bg}`}>
        <div className="flex items-center gap-2.5">
          <IconComponent className="w-5 h-5 shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <span>Decision: {verdict}</span>
            </div>
            <div className="text-[10px] opacity-90 leading-tight">
              SLA: {badgeInfo.sla}
            </div>
          </div>
        </div>
        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-black/20 shrink-0">
          Action Mandated
        </span>
      </div>
    </div>
  );
};
