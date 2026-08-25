import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Building2,
  Lock,
  PieChart,
  ShieldCheck,
  Server
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';

export const ResultCard = ({ result, isSimulatingFailure, onToggleFailure, onRetry }) => {
  if (!result) return null;

  const isPartial = result.status === 'Partial' || result.completeness < 100;

  return (
    <div className="space-y-6">
      {/* Failure Simulation Banner Control */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">Hackathon Interactive Simulation Mode:</span>
          <span className="text-slate-400 hidden sm:inline">Test federated fault tolerance when a hospital database node drops offline.</span>
        </div>

        <button
          onClick={onToggleFailure}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold text-xs transition-all ${
            isSimulatingFailure
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{isSimulatingFailure ? "Restore Normal Nodes (3/3)" : "Simulate Institution Failure"}</span>
        </button>
      </div>

      {/* Partial Warning Alert */}
      {isPartial && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-amber-300">⚠ Partial Result Warning</h5>
              <p className="text-xs text-amber-100/90 mt-1">
                This result is incomplete because 1 participating institution (Hospital C) did not respond due to network latency timeout. The current aggregated total represents 66% of target clinical sites.
              </p>
            </div>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Institution</span>
          </button>
        </div>
      )}

      {/* Main Aggregated Result Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest">
              Federated Aggregated Result
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-5xl font-black tracking-tight text-white font-mono">
                {formatNumber(result.totalResult)}
              </h2>
              <span className="text-sm font-medium text-slate-400">
                Matching synthetic patient records
              </span>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Completeness</span>
              <span className={`text-base font-extrabold font-mono ${isPartial ? 'text-amber-400' : 'text-emerald-400'}`}>
                {result.completeness}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Privacy Risk</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                LOW
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Nodes Responded</span>
              <span className="text-base font-extrabold text-white font-mono">
                {result.institutions} / 3
              </span>
            </div>
          </div>
        </div>

        {/* Institution Breakdown Row */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Participating Institution Local Contributions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {result.breakdown?.map((hosp) => {
              const isFailed = hosp.status === 'Failed';
              const percent = result.totalResult > 0 ? Math.round((hosp.count / result.totalResult) * 100) : 0;

              return (
                <div
                  key={hosp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isFailed
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{hosp.name}</span>
                    <StatusBadge status={hosp.status} text={hosp.status} size="sm" />
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold font-mono text-white">
                      {isFailed ? '0' : formatNumber(hosp.count)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {isFailed ? '0%' : `${percent}% share`}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFailed ? 'bg-rose-500' : 'bg-brand-500'
                      }`}
                      style={{ width: `${isFailed ? 0 : percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Transfer Notice */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Data Transferred: <strong className="text-slate-200">Aggregate scalar results only (0 bytes of raw PHI transferred)</strong></span>
          </div>
          <span className="font-mono text-slate-500">Query ID: {result.id}</span>
        </div>
      </div>
    </div>
  );
};
