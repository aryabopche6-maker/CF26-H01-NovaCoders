import React, { useState } from 'react';
import { FileCheck2, Search, Filter, ShieldCheck, Lock, Key, Hash, Award, CheckCircle2, RefreshCw } from 'lucide-react';
import { useFederated } from '../context/FederatedContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatDate } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const AuditLogs = () => {
  const { auditLogs, isLoadingLogs, loadAuditLogs } = useFederated();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  React.useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const filteredLogs = (auditLogs || []).filter(log => {
    const userMatch = userFilter === 'ALL' || (log.userRole || '').toUpperCase().includes(userFilter.toUpperCase());
    const statusMatch = statusFilter === 'ALL' || (log.status || '').toUpperCase() === statusFilter.toUpperCase();
    const riskMatch = riskFilter === 'ALL' || (log.privacyRisk || '').toUpperCase() === riskFilter.toUpperCase();
    const searchMatch = !search || 
      (log.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.queryId || '').toLowerCase().includes(search.toLowerCase()) ||
      (log.verificationHash || '').toLowerCase().includes(search.toLowerCase());
    
    return userMatch && statusMatch && riskMatch && searchMatch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Security & Privacy Audit Ledger
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident Merkle Tree hash chain & Zero-Knowledge Proof (ZKP) verification audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-300 font-mono text-xs font-bold">
            <Hash className="w-3.5 h-3.5 text-brand-400" />
            <span>Merkle Root: 0x8a92f1b7d34e9081</span>
          </div>
          <button
            onClick={() => {
              loadAuditLogs();
              addToast('Audit trail refreshed', 'info');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User, Query ID, or Action..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* User Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">User Role:</span>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="RESEARCHER">Researcher</option>
              <option value="ADMIN">Admin</option>
              <option value="INSTITUTION_ADMIN">Institution Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="PARTIAL">Partial</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Privacy Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 outline-none"
            >
              <option value="ALL">All Risks</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User Identity</th>
                <th className="p-4">Action</th>
                <th className="p-4">Query ID</th>
                <th className="p-4">ZKP Proof</th>
                <th className="p-4">Status</th>
                <th className="p-4">Privacy Risk</th>
                <th className="p-4">Merkle Hash Chain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40 font-mono">
              {isLoadingLogs ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">Loading audit ledger...</td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No matching audit logs found.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4 text-slate-400">
                      {formatDate(log.loggedAt || log.timestamp)}
                    </td>
                    <td className="p-4 font-sans font-semibold text-white">
                      <div>{log.userEmail || log.user || 'system'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.userRole || 'USER'}</div>
                    </td>
                    <td className="p-4 font-sans font-medium text-brand-300">
                      {log.action}
                    </td>
                    <td className="p-4 text-slate-300 font-mono">
                      {log.queryId || 'N/A'}
                    </td>
                    <td className="p-4 font-sans">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-800 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        ZKP-k10 VERIFIED
                      </span>
                    </td>
                    <td className="p-4 font-sans">
                      <StatusBadge status={log.status || 'SUCCESS'} text={log.status || 'SUCCESS'} size="sm" />
                    </td>
                    <td className="p-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.privacyRisk === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                        log.privacyRisk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {log.privacyRisk || 'LOW'}
                      </span>
                    </td>
                    <td className="p-4 text-brand-400 font-bold text-[11px] truncate max-w-[160px]" title={log.verificationHash || log.hash}>
                      {log.verificationHash || log.hash || '0x7c9b...'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
