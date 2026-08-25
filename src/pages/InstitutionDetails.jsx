import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Server, Database, Activity, ShieldCheck, Lock, ArrowLeft, TableProperties } from 'lucide-react';
import { getInstitutionById } from '../services/institutionService';
import { StatusBadge } from '../components/common/StatusBadge';

export const InstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inst, setInst] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getInstitutionById(id);
      setInst(data);
    };
    fetch();
  }, [id]);

  if (!inst) return null;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation */}
      <button
        onClick={() => navigate('/institutions')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Institutions</span>
      </button>

      {/* Institution Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white">{inst.name}</h1>
              <StatusBadge status={inst.status} text={inst.status.toUpperCase()} />
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{inst.region}</span>
              <span>•</span>
              <span>{inst.compliance}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Database Engine</span>
            <span className="text-sm font-bold text-white font-mono">{inst.dbType}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Handshake Latency</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{inst.latency}ms</span>
          </div>
        </div>
      </div>

      {/* Available Datasets Schema Preview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Available Local Database Schemas & Table Preview
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium flex items-center gap-1">
            <Lock className="w-3 h-3" /> PHI Guard Enforced (Zero Raw Records Exposed)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {inst.schemas?.map((table) => (
            <div key={table.table} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-brand-300">
                  Table: {table.table}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {table.count} local rows
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Column Schema Definition</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {table.columns.map((col) => (
                    <span key={col} className="px-2 py-1 rounded bg-slate-950 text-slate-300 font-mono border border-slate-800 text-[11px]">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
