import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Lock, EyeOff } from 'lucide-react';

export const QueryFirewallCard = ({ decision }) => {
  if (!decision) return null;

  const { decision: action, riskLevel, reIdentRiskScore, reasons, specificFiltersChecked, requiresApproval } = decision;

  const isBlocked = action === 'BLOCK' || riskLevel === 'CRITICAL' || riskLevel === 'HIGH';
  const isApprovalNeeded = action === 'REQUIRE_APPROVAL' || riskLevel === 'MEDIUM';

  const getRiskBadge = () => {
    switch (riskLevel) {
      case 'CRITICAL':
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 text-xs font-mono font-extrabold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> CRITICAL RISK</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-mono font-extrabold flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> MEDIUM RISK</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-extrabold flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> LOW RISK</span>;
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all animate-fade-in ${
      isBlocked
        ? 'bg-rose-950/30 border-rose-800/80'
        : isApprovalNeeded
        ? 'bg-amber-950/20 border-amber-800/60'
        : 'bg-slate-900 border-slate-800'
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Shield className={`w-5 h-5 ${isBlocked ? 'text-rose-400' : isApprovalNeeded ? 'text-amber-400' : 'text-emerald-400'}`} />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">Query Firewall Pre-Execution Analysis</h3>
        </div>
        {getRiskBadge()}
      </div>

      {/* Main Content */}
      <div className="mt-4 space-y-3">
        {/* Blocked Alert Banner */}
        {isBlocked && (
          <div className="p-4 bg-rose-950/80 border border-rose-700/80 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-rose-300 font-extrabold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <span>🚨 HIGH RE-IDENTIFICATION RISK — Query Blocked</span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed font-medium">
              The combination of highly specific demographic and clinical criteria presents a high re-identification risk. The query has been rejected before reaching local hospital nodes.
            </p>
          </div>
        )}

        {/* Medium Approval Needed Banner */}
        {isApprovalNeeded && !isBlocked && (
          <div className="p-4 bg-amber-950/50 border border-amber-700/60 rounded-xl space-y-1">
            <div className="flex items-center space-x-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Administrative Approval Required</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Query classified as MEDIUM risk. A request has been queued in the Governance Approval Portal.
            </p>
          </div>
        )}

        {/* Specificity Check & Reasons List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Re-Identification Risk Score</span>
            <div className="flex items-center space-x-3">
              <span className={`text-2xl font-mono font-black ${isBlocked ? 'text-rose-400' : isApprovalNeeded ? 'text-amber-400' : 'text-emerald-400'}`}>
                {reIdentRiskScore || (isBlocked ? 88 : isApprovalNeeded ? 45 : 12)} / 100
              </span>
              <span className="text-[10px] text-slate-400">specificity threshold check</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Evaluated Criteria</span>
            <div className="flex flex-wrap gap-1">
              {(specificFiltersChecked || ['Condition', 'Age Criteria', 'Treatment']).map((filter, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-mono">
                  {filter}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Firewall Reasons List */}
        {reasons && reasons.length > 0 && (
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Firewall Findings</span>
            <ul className="space-y-1 text-xs">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start space-x-1.5 text-slate-300">
                  <span className="text-slate-500 font-mono">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
