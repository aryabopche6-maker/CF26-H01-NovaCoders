import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History, Search, Eye, ArrowRight, AlertTriangle,
  CheckCircle2, Clock, XCircle, Zap, Shield, Filter,
  RefreshCw, ChevronDown, Activity, Database, Award
} from 'lucide-react';
import { useFederated } from '../context/FederatedContext';
import { formatNumber, formatDate, formatDuration } from '../utils/formatters';
import { ClinicalQueryPassportModal } from '../components/passport/ClinicalQueryPassportModal';
import { useToast } from '../context/ToastContext';

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${c.color}`}>
      <Shield className="w-3 h-3" />
      {c.label}
    </span>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    EXECUTED:         { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80', icon: CheckCircle2 },
    SUCCESS:          { color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80', icon: CheckCircle2 },
    PARTIAL:          { color: 'text-yellow-400 bg-yellow-950/60 border-yellow-800/80',   icon: AlertTriangle },
    PENDING_APPROVAL: { color: 'text-blue-400 bg-blue-950/60 border-blue-800/80',         icon: Clock },
    FAILED:           { color: 'text-rose-400 bg-rose-950/60 border-rose-800/80',         icon: XCircle },
    BLOCKED:          { color: 'text-rose-400 bg-rose-950/60 border-rose-800/80',         icon: XCircle },
    REJECTED:         { color: 'text-rose-400 bg-rose-950/60 border-rose-800/80',         icon: XCircle },
  };
  const c = cfg[status] || cfg.PARTIAL;
  const Icon = c.icon;
  const label = status === 'PENDING_APPROVAL' ? 'PENDING' : status;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shadow-sm ${c.color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// ─── Mode Badge ───────────────────────────────────────────────────────────────
const ModeBadge = ({ mode }) => {
  if (mode === 'EMERGENCY') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border text-orange-400 bg-orange-950/60 border-orange-800/80 shadow-sm animate-pulse">
        <Zap className="w-3 h-3" />
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
      <div className="w-20 h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-bold font-mono ${value === 100 ? 'text-emerald-400' : value >= 66 ? 'text-yellow-400' : 'text-rose-400'}`}>
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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <History className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">Federated Query History</h1>
          </div>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Immutable audit trail of all federated clinical queries — execution results, privacy risk, trust certificates, and node contributions.
          </p>
        </div>
        <button
          onClick={() => {
            loadQueryHistory();
            addToast('Query history refreshed', 'info');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors shadow-sm border border-slate-700/50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Queries', value: stats.total,     color: 'text-brand-400' },
          { label: 'Executed',      value: stats.executed,  color: 'text-emerald-400' },
          { label: 'Pending Approval', value: stats.pending, color: 'text-blue-400' },
          { label: 'Emergency Mode', value: stats.emergency, color: 'text-orange-400' },
        ].map(({ label, value, color }) => (
          <motion.div variants={itemVariants} key={label} className="glass-panel rounded-2xl border border-slate-700/50 p-5 text-center shadow-glass-sm hover:-translate-y-1 hover:shadow-glass hover:bg-slate-800/40 transition-all duration-300">
            <div className={`text-3xl font-extrabold font-mono ${color} drop-shadow-sm`}>{value}</div>
            <div className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">{label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="glass-panel p-4 rounded-2xl border border-slate-700/50 flex flex-wrap items-center gap-4 shadow-glass-sm">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by Query ID, condition, treatment..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm font-medium text-slate-200 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all shadow-inner"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm font-medium text-slate-200 outline-none appearance-none cursor-pointer focus:border-brand-400 hover:border-brand-500/50 transition-all shadow-inner"
          >
            <option value="ALL">All Status</option>
            <option value="EXECUTED">Executed</option>
            <option value="PARTIAL">Partial</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="BLOCKED">Blocked</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Risk Filter */}
        <div className="relative">
          <Shield className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm font-medium text-slate-200 outline-none appearance-none cursor-pointer focus:border-brand-400 hover:border-brand-500/50 transition-all shadow-inner"
          >
            <option value="ALL">All Risk</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Mode Filter */}
        <div className="relative">
          <Zap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={modeFilter}
            onChange={e => setModeFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-sm font-medium text-slate-200 outline-none appearance-none cursor-pointer focus:border-brand-400 hover:border-brand-500/50 transition-all shadow-inner"
          >
            <option value="ALL">All Modes</option>
            <option value="NORMAL">Normal</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Result count */}
        <span className="text-sm font-bold text-slate-400 ml-auto bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50">{filtered.length} results</span>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl border border-slate-700/50 overflow-hidden shadow-glass relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-700/50 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="p-5 whitespace-nowrap">Query ID</th>
                <th className="p-5">Clinical Question</th>
                <th className="p-5 whitespace-nowrap">Nodes</th>
                <th className="p-5 whitespace-nowrap">Cohort Total</th>
                <th className="p-5 whitespace-nowrap">Status</th>
                <th className="p-5 whitespace-nowrap">Risk</th>
                <th className="p-5 whitespace-nowrap">Completeness</th>
                <th className="p-5 whitespace-nowrap">Executed At</th>
                <th className="p-5 text-right whitespace-nowrap">Trust Passport</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 bg-slate-950/40">
              {isLoadingHistory ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-brand-400" />
                      <span className="font-medium text-sm">Loading query history...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-16 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <History className="w-10 h-10 text-slate-600" />
                      <span className="font-semibold text-slate-300 text-base">No queries found</span>
                      <span className="text-xs">Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <motion.tr
                    whileHover={{ backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                    key={item.id}
                    className="transition-colors cursor-pointer group"
                    onClick={(e) => handleOpenPassport(item, e)}
                  >
                    {/* Query ID */}
                    <td className="p-5">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono font-bold text-brand-400 group-hover:text-brand-300 transition-colors">{item.id}</span>
                        {item.queryMode === 'EMERGENCY' && <ModeBadge mode="EMERGENCY" />}
                      </div>
                    </td>

                    {/* Clinical Question */}
                    <td className="p-5 max-w-xs">
                      <p className="font-bold text-slate-100 truncate group-hover:text-white transition-colors" title={item.rawQuery}>
                        "{item.rawQuery}"
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                        {item.condition !== '—' ? item.condition : ''}
                        {item.condition !== '—' && item.treatment !== '—' ? ' • ' : ''}
                        {item.treatment !== '—' ? item.treatment : ''}
                      </p>
                    </td>

                    {/* Nodes */}
                    <td className="p-5 text-slate-300 font-mono font-medium">
                      <span className="bg-slate-900/80 px-2 py-1 rounded-md border border-slate-700/50">
                        {item.institutions}/{item.totalInstitutions}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="p-5 font-mono font-extrabold text-white">
                      {item.status === 'PENDING_APPROVAL' || item.status === 'BLOCKED' ? <span className="text-slate-500">—</span> : <span className="text-emerald-400">{formatNumber(item.totalResult)}</span>}
                    </td>

                    {/* Status */}
                    <td className="p-5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Risk */}
                    <td className="p-5">
                      <RiskBadge risk={item.privacyRisk} />
                    </td>

                    {/* Completeness */}
                    <td className="p-5">
                      {item.status === 'PENDING_APPROVAL' || item.status === 'BLOCKED'
                        ? <span className="text-slate-500">—</span>
                        : <CompletenessBar value={item.completeness} />}
                    </td>

                    {/* Date */}
                    <td className="p-5 text-slate-400 font-mono whitespace-nowrap text-xs font-medium">
                      {formatDate(item.date)}
                    </td>

                    {/* Action Passport */}
                    <td className="p-5 text-right" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenPassport(item, e)}
                        className="px-3 py-2 rounded-xl bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 text-brand-300 transition-all duration-300 inline-flex items-center gap-2 font-bold text-xs group-hover:shadow-glow group-hover:border-brand-500/60"
                      >
                        <Award className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                        <span>Passport</span>
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Passport Modal */}
      <ClinicalQueryPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        passport={passportQuery?.passport}
        queryResult={passportQuery}
      />
    </motion.div>
  );
};
