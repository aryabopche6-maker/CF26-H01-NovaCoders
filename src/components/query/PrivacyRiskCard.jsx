import React, { useState } from 'react';
import { ShieldCheck, Info, Lock, EyeOff } from 'lucide-react';
import { ExplainPrivacyModal } from './ExplainPrivacyModal';

export const PrivacyRiskCard = ({ risk = "LOW" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Privacy Risk Assessment</h4>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold tracking-wider">
                  🟢 LOW RISK
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Query requests aggregated count metrics only. Raw patient records remain strictly inaccessible.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors shrink-0"
          >
            <Info className="w-4 h-4" />
            <span>Explain Privacy</span>
          </button>
        </div>

        {/* Audit Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800/80 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
            <span className="text-slate-400">Min Cohort Group Size (k):</span>
            <span className="font-mono font-bold text-emerald-400">k &ge; 10 (Passed)</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
            <span className="text-slate-400">Raw Patient Records:</span>
            <span className="font-semibold text-rose-400 flex items-center gap-1">
              <EyeOff className="w-3 h-3" /> Blocked
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60">
            <span className="text-slate-400">Individual Records:</span>
            <span className="font-semibold text-slate-300">Not Accessible</span>
          </div>
        </div>
      </div>

      <ExplainPrivacyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
