import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History, Search, Eye, ArrowRight, AlertTriangle,
  CheckCircle2, Clock, XCircle, Zap, Shield, Filter,
  RefreshCw, ChevronDown, Activity, Database, Award
} from 'lucide-react';
import { useFederated } from '../context/FederatedContext';
import { formatNumber, formatDate, formatDuration } from '../utils/formatters';
import { ClinicalQueryPassportModal } from '../components/passport/ClinicalQueryPassportModal';
import { useToast } from '../context/ToastContext';

// ─── Privacy Risk Badge ───────────────────────────────────────────────────────
const RiskBadge = ({ risk }) => {
  const cfg = {
    LOW:    { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', label: 'LOW' },
    MEDIUM: { color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800',   label: 'MEDIUM' },
    HIGH:   { color: 'text-rose-400 bg-rose-950/60 border-rose-800',         label: 'HIGH' },
    CRITICAL: { color: 'text-rose-400 bg-rose-950/60 border-rose-800',       label: 'CRITICAL' },
  };
  const c = cfg[risk] || cfg.LOW;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.color}`}>
      <Shield className="w-2.5 h-2.5" />
      {c.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    EXECUTED:         { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', icon: CheckCircle2 },
    SUCCESS:          { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800', icon: CheckCircle2 },
    PARTIAL:          { color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800',   icon: AlertTriangle },
    PENDING_APPROVAL: { color: 'text-blue-400 bg-blue-950/60 border-blue-800',         icon: Clock },
    FAILED:           { color: 'text-rose-400 bg-rose-950/60 border-rose-800',         icon: XCircle },
    BLOCKED:          { color: 'text-rose-400 bg-rose-950/60 border-rose-800',         icon: XCircle },
    REJECTED:         { color: 'text-rose-400 bg-rose-950/60 border-rose-800',         icon: XCircle },
  };
  const c = cfg[status] || cfg.PARTIAL;
  const Icon = c.icon;
  const label = status === 'PENDING_APPROVAL' ? 'PENDING' : status;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${c.color}`}>
      <Icon className="w-2.5 h-2.5" />
      {label}
    </span>
  );
};

// ─── Mode Badge ───────────────────────────────────────────────────────────────
const ModeBadge = ({ mode }) => {
  if (mode === 'EMERGENCY') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border text-orange-400 bg-orange-950/60 border-orange-800">
        <Zap className="w-2.5 h-2.5" />
        EMERGENCY
      </span>
    );
  }
  return null;
};

// ─── Completeness Bar ─────────────────────────────────────────────────────────
const CompletenessBar = ({ value }) => {
  const color = value === 100 ? 'bg-emerald-500' : value >= 66 ? 'bg-yellow-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-[10px] font-bold font-mono ${value === 100 ? 'text-emerald-400' : value >= 66 ? 'text-yellow-400' : 'text-rose-400'}`}>
        {value}%
      </span>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const QueryHistory = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { queryHistory, isLoadingHistory, loadQueryHistory } = useFederated();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [passportQuery, setPassportQuery] = useState(null);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');

  const normalize = (item) => ({
    ...item,
    id:           item.queryId   || item.id   || '—',
    rawQuery:     item.rawQuestion || item.rawQuery || '—',
    condition:    item.conditionValue || item.condition || '—',
    treatment:    item.treatmentValue || item.treatment || '—',
    date:         item.createdAt  || item.date || null,
    institutions: item.institutionBreakdown
                    ? item.institutionBreakdown.filter(n => n.status === 'SUCCESS').length
                    : (item.institutions || 0),
    totalInstitutions: item.institutionBreakdown?.length || item.totalInstitutions || 3,
    privacyRisk:  item.privacyRisk || 'LOW',
    queryMode:    item.queryMode   || 'NORMAL',
    purpose:      item.purpose     || 'RESEARCH',
    status:       item.status      || 'EXECUTED',
    totalResult:  item.totalResult  ?? item.totalPatients ?? 0,
    completeness: item.completeness ?? 100,
    executionTimeMs: item.executionTimeMs || item.executionTime || 0,
  });

  const normalized = (queryHistory || []).map(normalize);

  const filtered = normalized.filter(item => {
    const matchSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.rawQuery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.treatment && item.treatment.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchRisk   = riskFilter   === 'ALL' || item.privacyRisk === riskFilter;
    const matchMode   = modeFilter   === 'ALL' || item.queryMode === modeFilter;
    return matchSearch && matchStatus && matchRisk && matchMode;
  });

  const stats = {
    total:     normalized.length,
    executed:  normalized.filter(i => i.status === 'EXECUTED').length,
    pending:   normalized.filter(i => i.status === 'PENDING_APPROVAL').length,
    emergency: normalized.filter(i => i.queryMode === 'EMERGENCY').length,
  };

  const handleOpenPassport = (item, e) => {
    e.stopPropagation();
    setPassportQuery(item);
    setIsPassportOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Federated Query History</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit trail of all federated clinical queries — execution results, privacy risk, trust certificates, and node contributions.
          </p>
        </div>
        <button
          onClick={() => {
            loadQueryHistory();
            addToast('Query history refreshed', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Queries', value: stats.total,     color: 'text-brand-400' },
          { label: 'Executed',      value: stats.executed,  color: 'text-emerald-400' },
          { label: 'Pending Approval', value: stats.pending, color: 'text-blue-400' },
          { label: 'Emergency Mode', value: stats.emergency, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel rounded-2xl border border-slate-800 p-4 text-center">
            <div className={`text-2xl font-extrabold font-mono ${color}`}>{value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Query ID, condition, treatment..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-8 pr-7 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none appearance-none cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="EXECUTED">Executed</option>
            <option value="PARTIAL">Partial</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <Shield className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="pl-8 pr-7 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none appearance-none cursor-pointer"
          >
            <option value="ALL">All Risk</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Mode Filter */}
        <div className="relative">
          <Zap className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            className="pl-8 pr-7 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 outline-none appearance-none cursor-pointer"
          >
            <option value="ALL">All Modes</option>
            <option value="NORMAL">Normal</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Result count */}
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4 whitespace-nowrap">Query ID</th>
                <th className="p-4">Clinical Question</th>
                <th className="p-4 whitespace-nowrap">Nodes</th>
                <th className="p-4 whitespace-nowrap">Cohort Total</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap">Risk</th>
                <th className="p-4 whitespace-nowrap">Completeness</th>
                <th className="p-4 whitespace-nowrap">Executed At</th>
                <th className="p-4 text-right whitespace-nowrap">Trust Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {isLoadingHistory ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-brand-400" />
                      <span>Loading query history...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <History className="w-8 h-8 text-slate-700" />
                      <span className="font-semibold text-slate-400">No queries found</span>
                      <span className="text-[11px]">Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                    onClick={(e) => handleOpenPassport(item, e)}
                  >
                    {/* Query ID */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono font-bold text-brand-400">{item.id}</span>
                        {item.queryMode === 'EMERGENCY' && <ModeBadge mode="EMERGENCY" />}
                      </div>
                    </td>

                    {/* Clinical Question */}
                    <td className="p-4 max-w-xs">
                      <p className="font-semibold text-slate-100 truncate" title={item.rawQuery}>
                        "{item.rawQuery}"
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.condition !== '—' ? item.condition : ''}
                        {item.condition !== '—' && item.treatment !== '—' ? ' • ' : ''}
                        {item.treatment !== '—' ? item.treatment : ''}
                      </p>
                    </td>

                    {/* Nodes */}
                    <td className="p-4 text-slate-300 font-mono">
                      {item.institutions}/{item.totalInstitutions}
                    </td>

                    {/* Total */}
                    <td className="p-4 font-mono font-extrabold text-white">
                      {item.status === 'PENDING_APPROVAL' || item.status === 'BLOCKED' ? '—' : formatNumber(item.totalResult)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Risk */}
                    <td className="p-4">
                      <RiskBadge risk={item.privacyRisk} />
                    </td>

                    {/* Completeness */}
                    <td className="p-4">
                      {item.status === 'PENDING_APPROVAL' || item.status === 'BLOCKED'
                        ? <span className="text-slate-500">—</span>
                        : <CompletenessBar value={item.completeness} />}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-slate-400 font-mono whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>

                    {/* Action Passport */}
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenPassport(item, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 border border-brand-500/40 text-brand-300 transition-colors inline-flex items-center gap-1.5 font-bold text-xs"
                      >
                        <Award className="w-3.5 h-3.5 text-brand-400" />
                        <span>Passport 🛂</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Passport Modal */}
      <ClinicalQueryPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        passport={passportQuery?.passport}
        queryResult={passportQuery}
      />
    </div>
  );
};
