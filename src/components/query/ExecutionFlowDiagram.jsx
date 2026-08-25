import React from 'react';
import { User, GitMerge, Building2, Layers, CheckCircle2, XCircle } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const ExecutionFlowDiagram = ({ breakdown = [], totalResult = 300, isPartial = false }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 my-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <span>Federated Architecture Visual Flow</span>
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Query the Data without Moving the Data
            </span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Zero data centralisation: Raw clinical records remain inside hospital firewalls; only aggregated counts travel to the aggregator.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 py-4">
        {/* Top Node: Researcher */}
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-xl flex items-center gap-3 border border-brand-400/40 px-6">
            <User className="w-5 h-5" />
            <div>
              <p className="text-xs text-brand-200 font-medium uppercase tracking-wider">Origin</p>
              <p className="text-sm font-bold">Researcher Query</p>
            </div>
          </div>
        </div>

        {/* Down Arrow connector */}
        <div className="w-0.5 h-6 bg-gradient-to-b from-brand-500 to-indigo-500 relative">
          <div className="absolute top-1/2 -left-1 -mt-1 w-2 h-2 rounded-full bg-brand-400 animate-ping" />
        </div>

        {/* Node 2: Query Planner */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-white shadow-lg flex items-center gap-3 px-6">
          <GitMerge className="w-5 h-5 text-brand-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Federated Orchestrator</p>
            <p className="text-sm font-bold">Query Planner & Schema Resolver</p>
          </div>
        </div>

        {/* Connector split lines */}
        <div className="w-full max-w-2xl relative flex justify-around items-center py-2">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-clinical-teal" />
        </div>

        {/* Three Participating Hospitals Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
          {breakdown.map((hosp) => {
            const isFailed = hosp.status === 'Failed';
            return (
              <div
                key={hosp.id}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isFailed
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:border-brand-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-4 h-4 ${isFailed ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <span className="text-xs font-bold truncate">{hosp.name}</span>
                  </div>
                  {isFailed ? (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Database:</span>
                    <span className="font-mono text-slate-200">{hosp.db}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Execution:</span>
                    <span className="font-mono">{hosp.time ? `${hosp.time}ms` : 'Timeout'}</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-[11px] text-slate-400">Local Result:</span>
                    <span className={`text-base font-extrabold font-mono ${isFailed ? 'text-rose-400' : 'text-brand-400'}`}>
                      {isFailed ? 'FAILED' : formatNumber(hosp.count)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Connectors into Aggregator */}
        <div className="w-full max-w-2xl relative flex justify-around items-center py-2">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-brand-500 via-indigo-500 to-clinical-teal" />
        </div>

        <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-emerald-500" />

        {/* Bottom Aggregator Node */}
        <div className="p-4 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl flex items-center gap-6 px-8">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Zero-Knowledge Aggregator
            </p>
            <p className="text-2xl font-extrabold text-white font-mono">
              {formatNumber(totalResult)} <span className="text-xs font-normal text-slate-400">matching patients</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
