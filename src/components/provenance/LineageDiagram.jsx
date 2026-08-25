import React from 'react';
import { GitBranch, ShieldCheck, CheckCircle2, User, Building2, Layers, Key } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const LineageDiagram = ({ queryData }) => {
  const q = queryData || {
    id: "Q-1024",
    rawQuery: "How many diabetic patients above 40 received insulin treatment?",
    totalResult: 300,
    date: "2026-08-23T12:45:00Z",
    breakdown: [
      { id: "hosp-a", name: "Hospital A", count: 120, time: 720, status: "Completed", db: "MySQL 8.0" },
      { id: "hosp-b", name: "Hospital B", count: 85, time: 1100, status: "Completed", db: "PostgreSQL 15" },
      { id: "hosp-c", name: "Hospital C", count: 95, time: 810, status: "Completed", db: "MySQL 8.0" }
    ]
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-brand-400" />
            <h3 className="text-base font-bold text-white">Cryptographic Data Lineage & Provenance</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete audit trace detailing local execution nodes, cryptographic proof hashes, and aggregation logic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 text-brand-400 border border-slate-800">
            Query ID: {q.id}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
            Immutable Audit Trail
          </span>
        </div>
      </div>

      {/* Visual Provenance Flow Tree */}
      <div className="space-y-6">
        {/* Step 1: User Request */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 ring-4 ring-slate-950">
              <User className="w-5 h-5" />
            </div>
            <div className="w-0.5 h-10 bg-brand-500/40 my-1" />
          </div>
          <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-brand-400">Step 1: Clinical Intent Submission</span>
              <span className="text-slate-500 font-mono">Timestamp: {new Date(q.date).toLocaleTimeString()}</span>
            </div>
            <p className="text-sm font-semibold text-white">"{q.rawQuery}"</p>
            <p className="text-xs text-slate-400 mt-1">
              Submitted by Dr. Sarah Lin (Senior Clinical Researcher) • Token Auth Validated
            </p>
          </div>
        </div>

        {/* Step 2: Distributed Execution Nodes */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 ring-4 ring-slate-950">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="w-0.5 h-10 bg-indigo-500/40 my-1" />
          </div>
          <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-indigo-400">Step 2: Local Hospital Node Calculations</span>
              <span className="text-slate-500 font-mono">Parallel Execution</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {q.breakdown?.map((hosp) => (
                <div key={hosp.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-white mb-1">
                    <span>{hosp.name}</span>
                    <span className="text-emerald-400">{hosp.status}</span>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-slate-400">
                    <div>Engine: {hosp.db}</div>
                    <div>Execution: {hosp.time}ms</div>
                    <div className="text-white font-bold pt-1 border-t border-slate-800 flex justify-between">
                      <span>Local COUNT:</span>
                      <span className="text-brand-400">{formatNumber(hosp.count)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Synthesis & Provenance Certificate */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 ring-4 ring-slate-950">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex-1 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-bold text-emerald-400">Step 3: Aggregation & Final Provenance Verification</span>
              <span className="text-slate-500 font-mono">Zero-Knowledge Verification</span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-3xl font-extrabold text-white font-mono">{formatNumber(q.totalResult)}</span>
              <span className="text-xs text-slate-400">
                Synthesis Formula: {q.breakdown?.map(b => b.count).join(' + ')} = {q.totalResult}
              </span>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-brand-400" />
                <span>Verification Ledger Hash:</span>
              </span>
              <span className="text-brand-300 font-bold">0x8f2c7a91b4e03f56a0991823c</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
