import React from 'react';
import { Activity, Clock, ShieldCheck, Database, Zap, Layers, Server } from 'lucide-react';
import { PERFORMANCE_STATS, CENTRALIZED_VS_FEDERATED } from '../data/analyticsData';
import { InstitutionLatencyChart } from '../components/charts/InstitutionLatencyChart';
import { QueryTrendChart } from '../components/charts/QueryTrendChart';

export const Performance = () => {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Federated Performance & Benchmarks
            </h1>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono">
            Demo Benchmark Metrics
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Detailed latency breakdown, network overhead, and architectural comparison against centralized data warehouses.
        </p>
      </div>

      {/* Latency Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Query Time</span>
          <span className="text-2xl font-black text-white font-mono">{PERFORMANCE_STATS.totalQueryTime}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Query Planning</span>
          <span className="text-2xl font-black text-brand-400 font-mono">{PERFORMANCE_STATS.queryPlanningTime}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospital A</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{PERFORMANCE_STATS.hospitalAExecution}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospital B</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">{PERFORMANCE_STATS.hospitalBExecution}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Hospital C</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{PERFORMANCE_STATS.hospitalCExecution}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Aggregation</span>
          <span className="text-2xl font-black text-clinical-teal font-mono">{PERFORMANCE_STATS.aggregationTime}</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InstitutionLatencyChart />
        <QueryTrendChart />
      </div>

      {/* Centralized vs Federated Section (Requirement 21) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Why Federated? (Centralized vs. Federated Comparison)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Evaluating security, bandwidth, speed, and privacy trade-offs between traditional centralization and Clinical Data Fabric.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-mono">
            Demo Benchmark
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Benchmark Metric</th>
                <th className="p-4 text-rose-400">Centralized Warehouse Model</th>
                <th className="p-4 text-emerald-400">Federated Clinical Data Fabric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {CENTRALIZED_VS_FEDERATED.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-900/30">
                  <td className="p-4 font-bold text-white">{row.metric}</td>
                  <td className="p-4 text-slate-300 bg-rose-950/10 font-mono">{row.centralized}</td>
                  <td className="p-4 text-emerald-300 bg-emerald-950/10 font-mono font-bold">{row.federated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
