import React from 'react';
import { Building2, Server, RefreshCw } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const InstitutionExecutionCard = ({ institution, onTestConnection, onSelect }) => {
  const isOnline = institution.status === 'online';
  const isSlow = institution.status === 'slow';
  const isOffline = institution.status === 'offline';

  return (
    <div
      onClick={onSelect}
      className={`glass-panel p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-xl flex flex-col justify-between ${
        isOffline
          ? 'border-rose-500/40 bg-rose-950/10'
          : isSlow
          ? 'border-amber-500/40 bg-amber-950/10'
          : 'border-slate-800 hover:border-brand-500/50'
      }`}
    >
      <div>
        {/* Top Icon & Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`p-2 rounded-xl shrink-0 ${
            isOffline ? 'bg-rose-500/20 text-rose-400' : isSlow ? 'bg-amber-500/20 text-amber-400' : 'bg-brand-500/20 text-brand-400'
          }`}>
            <Building2 className="w-4 h-4" />
          </div>
          <StatusBadge status={institution.status} text={institution.status.toUpperCase()} size="sm" />
        </div>

        {/* Institution Title & Meta */}
        <div className="space-y-1">
          <h4
            className="font-bold text-xs sm:text-sm text-white group-hover:text-brand-300 transition-colors line-clamp-1"
            title={institution.name}
          >
            {institution.name}
          </h4>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
            <Server className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{institution.dbType}</span>
            <span>•</span>
            <span className="truncate">{institution.region}</span>
          </p>
        </div>

        {/* Grid Specs */}
        <div className="grid grid-cols-2 gap-2 my-3 pt-2.5 border-t border-slate-800/80 text-xs">
          <div className="p-2 rounded-lg bg-slate-900/60 min-w-0">
            <span className="text-slate-500 block text-[10px] truncate">Latency</span>
            <span className={`font-mono font-bold text-xs truncate block ${
              isOffline ? 'text-rose-400' : isSlow ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isOffline ? 'Unreachable' : `${institution.latency}ms`}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/60 min-w-0">
            <span className="text-slate-500 block text-[10px] truncate">Datasets</span>
            <span className="font-mono font-bold text-xs text-slate-200 block truncate">
              {institution.datasetCount}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t border-slate-800/50 text-[11px]">
        <span className="text-slate-400 truncate">
          Last: {institution.lastQuery}
        </span>
        {onTestConnection && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTestConnection(institution.id);
            }}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-400 hover:text-brand-300 transition-colors shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Test Handshake</span>
          </button>
        )}
      </div>
    </div>
  );
};
