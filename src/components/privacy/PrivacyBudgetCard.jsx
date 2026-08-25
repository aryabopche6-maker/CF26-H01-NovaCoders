import React from 'react';
import { Shield, Zap, Info, Activity } from 'lucide-react';

export const PrivacyBudgetCard = ({ remainingEpsilon = 8.5, totalEpsilon = 10.0, cost = 0.5 }) => {
  const percentage = Math.max(0, Math.min(100, (remainingEpsilon / totalEpsilon) * 100));

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Differential Privacy Budget (ε)</h4>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
          Laplace Noise Active
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Remaining Budget:</span>
          <span className="text-white font-extrabold">{remainingEpsilon.toFixed(1)} / {totalEpsilon.toFixed(1)} ε</span>
        </div>
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              percentage > 50 ? 'bg-emerald-500' : percentage > 20 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2">
        <span>Query Cost: -{cost} ε</span>
        <span className="flex items-center gap-1 text-slate-400">
          <Info className="w-3 h-3 text-cyan-400" />
          Prevents aggregate reconstruction attacks over time
        </span>
      </div>
    </div>
  );
};
