import React, { useState } from 'react';
import {
  ShieldCheck, Award, CheckCircle2, AlertTriangle, XCircle,
  Building2, Calendar, User, FileText, Zap, Hash, Download, Copy, X, ShieldAlert
} from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

export const ClinicalQueryPassportModal = ({ isOpen, onClose, passport, queryResult }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen || (!passport && !queryResult)) return null;

  // Fallback defaults if passport object is built from raw queryResult
  const p = passport || {
    queryId: queryResult?.id || queryResult?.queryId || 'QRY-2026-00124',
    version: '1.0.0',
    requesterName: 'Dr. Sarah Lin',
    requesterRole: 'RESEARCHER',
    purpose: queryResult?.purpose || 'CLINICAL_RESEARCH',
    rawQuestion: queryResult?.rawQuestion || 'Diabetic patients over 50 receiving insulin',
    verifications: {
      'Authorization Verification': true,
      'Privacy Protection (k=10)': true,
      'Cryptographic Audit Lineage': true,
      'Execution Integrity': queryResult?.status !== 'BLOCKED'
    },
    totalInstitutions: 3,
    activeInstitutions: 3,
    successfulInstitutions: queryResult?.status === 'PARTIAL' ? 2 : queryResult?.status === 'BLOCKED' ? 0 : 3,
    failedInstitutions: queryResult?.status === 'PARTIAL' ? 1 : 0,
    pausedInstitutions: 0,
    coveragePercentage: queryResult?.completeness || (queryResult?.status === 'PARTIAL' ? 66 : queryResult?.status === 'BLOCKED' ? 0 : 100),
    dataFreshnessPercentage: 94,
    trustScore: queryResult?.status === 'BLOCKED' ? 0 : queryResult?.status === 'PARTIAL' ? 76 : 94,
    trustStatus: queryResult?.status === 'BLOCKED' ? 'BLOCKED' : queryResult?.status === 'PARTIAL' ? 'PARTIAL RESULT' : 'HIGH CONFIDENCE',
    verificationHash: queryResult?.verificationHash || '0x9a8f23b1c4e7280d91f283a',
    executionTimestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'medium' }),
    explanation: 'Trust Score is based on authorization (20), privacy validation (20), institution coverage (30), data freshness (15), and schema mapping integrity (15).'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HIGH CONFIDENCE':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-500/50';
      case 'MEDIUM CONFIDENCE':
        return 'text-cyan-400 bg-cyan-950/80 border-cyan-500/50';
      case 'PARTIAL RESULT':
        return 'text-amber-400 bg-amber-950/80 border-amber-500/50';
      case 'BLOCKED':
        return 'text-rose-400 bg-rose-950/80 border-rose-500/50';
      default:
        return 'text-slate-300 bg-slate-900 border-slate-700';
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(p.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-brand-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-brand-500/10 border border-brand-500/30 rounded-2xl">
              <Award className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black uppercase tracking-wider text-white">Clinical Query Passport</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  TRUST CERTIFICATE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Query-Result Trust Certificate for federated clinical execution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body Card */}
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Top Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Query ID</span>
              <span className="font-mono font-extrabold text-brand-400 text-sm">{p.queryId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Requester</span>
              <span className="font-bold text-slate-200">{p.requesterName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">({p.requesterRole})</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Purpose</span>
              <span className="font-bold text-slate-200">{p.purpose}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Timestamp</span>
              <span className="font-mono text-slate-300 text-[11px]">{p.executionTimestamp}</span>
            </div>
          </div>

          {/* Trust Score & Status Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
            {/* Trust Meter */}
            <div className="sm:col-span-2 flex items-center space-x-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={p.trustScore >= 90 ? 'text-emerald-400' : p.trustScore >= 75 ? 'text-amber-400' : 'text-rose-400'}
                    strokeDasharray={`${p.trustScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-mono font-black text-white text-base">{p.trustScore}</span>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explainable Trust Score</div>
                <div className="text-lg font-black text-white">{p.trustScore} / 100</div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{p.explanation}</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="text-right sm:text-center sm:border-l sm:border-slate-800 sm:pl-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Result Status</span>
              <span className={`inline-block px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold border ${getStatusColor(p.trustStatus)}`}>
                {p.trustStatus}
              </span>
            </div>
          </div>

          {/* Verifications Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security & Provenance Checks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(p.verifications || {}).map(([label, passed]) => (
                <div key={label} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-300 font-medium">{label}</span>
                  {passed ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>VERIFIED</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-rose-400 font-bold text-[11px]">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>FAILED</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Coverage & Freshness Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold">
                <span>Hospital Coverage</span>
                <span className="font-mono text-white">{p.successfulInstitutions} / {p.totalInstitutions} Nodes</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${p.coveragePercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${p.coveragePercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
                <span>Coverage: {p.coveragePercentage}%</span>
                {p.pausedInstitutions > 0 && <span className="text-amber-400">{p.pausedInstitutions} Paused</span>}
                {p.failedInstitutions > 0 && <span className="text-rose-400">{p.failedInstitutions} Offline</span>}
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold">
                <span>Data Freshness Index</span>
                <span className="font-mono text-cyan-400">{p.dataFreshnessPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${p.dataFreshnessPercentage}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 block pt-1">Live sync status across active hospital nodes</span>
            </div>
          </div>

          {/* Merkle Hash Chain Footer */}
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center space-x-2 truncate">
              <Hash className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-slate-400 text-[10px] font-bold uppercase shrink-0">Merkle Root Hash:</span>
              <span className="font-mono text-brand-300 text-[11px] truncate">{p.verificationHash}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-mono text-[10px] flex items-center space-x-1 shrink-0 transition"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
          >
            Close Passport
          </button>
        </div>
      </div>
    </div>
  );
};
