import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Shield, Clock, RefreshCw, ShieldAlert, User, Hash, Target, Zap, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFederated } from '../context/FederatedContext';
import { useToast } from '../context/ToastContext';

const RiskBadge = ({ level }) => {
  const config = {
    HIGH: {
      icon: Flame,
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      glow: 'shadow-red-500/20',
      dot: 'bg-red-500',
    },
    MEDIUM: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
      dot: 'bg-amber-500',
    },
    LOW: {
      icon: Shield,
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
      dot: 'bg-emerald-500',
    },
  };
  const c = config[level] || config.MEDIUM;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${c.bg} ${c.border} ${c.text} shadow-lg ${c.glow}`}>
      <Icon className="w-3 h-3" />
      {level} RISK
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'APPROVED', pulse: false },
    REJECTED: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400', label: 'REJECTED', pulse: false },
    PENDING:  { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', dot: 'bg-blue-400', label: 'PENDING', pulse: true },
  };
  const c = config[status] || config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${c.bg} ${c.border} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulse' : ''}`}></span>
      {c.label}
    </span>
  );
};

export function Approvals() {
  const { role } = useAuth();
  const { addToast } = useToast();
  const { approvals, isLoadingApprovals, loadApprovals, processApprovalAction } = useFederated();

  const [processingId, setProcessingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);

  useEffect(() => {
    // Initial load
    loadApprovals();

    // Auto-poll every 5 seconds for cross-device real-time sync
    const interval = setInterval(() => {
      loadApprovals();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadApprovals]);

  const handleProcess = async (approvalId, action) => {
    setProcessingId(approvalId);
    try {
      await processApprovalAction(approvalId, action, rejectionReason);
      setSelectedApproval(null);
      setRejectionReason('');
    } catch (error) {
      // Error handled by context
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'PENDING').length;
  const approvedCount = approvals.filter(a => a.status === 'APPROVED').length;
  const rejectedCount = approvals.filter(a => a.status === 'REJECTED').length;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <ShieldAlert className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Query Approval Workflow</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
              Governance
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1 ml-[52px]">
            Review and govern clinical queries classified as MEDIUM or HIGH privacy risk.
          </p>
        </div>
        <button
          onClick={() => { loadApprovals(); addToast('Approval requests refreshed', 'info'); }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium border border-slate-700 transition-all hover:border-slate-500 shadow"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingApprovals ? 'animate-spin' : ''}`} />
          Refresh List
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', value: pendingCount, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Clock },
          { label: 'Approved', value: approvedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle2 },
          { label: 'Rejected', value: rejectedCount, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle },
        ].map(({ label, value, color, bg, border, icon: Icon }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 flex items-center gap-3`}>
            <Icon className={`w-5 h-5 ${color}`} />
            <div>
              <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
              <div className="text-xs text-slate-400 font-medium">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table Panel ── */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Panel Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-100">Pending &amp; Reviewed Requests</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Shield className="w-3 h-3" />
            Anti-Self-Approval Enforced by Backend
          </div>
        </div>

        {/* Table Content */}
        {isLoadingApprovals ? (
          <div className="p-16 text-center">
            <RefreshCw className="w-8 h-8 text-slate-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading approval requests...</p>
          </div>
        ) : approvals.length === 0 ? (
          <div className="p-16 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500/40 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">No Pending Approvals</p>
            <p className="text-slate-600 text-xs mt-1">All query requests have been reviewed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="px-6 py-3 text-left"><div className="flex items-center gap-1.5"><Hash className="w-3 h-3" />Approval ID</div></th>
                  <th className="px-6 py-3 text-left"><div className="flex items-center gap-1.5"><User className="w-3 h-3" />Requester</div></th>
                  <th className="px-6 py-3 text-left"><div className="flex items-center gap-1.5"><Zap className="w-3 h-3" />Query ID</div></th>
                  <th className="px-6 py-3 text-left"><div className="flex items-center gap-1.5"><Target className="w-3 h-3" />Purpose</div></th>
                  <th className="px-6 py-3 text-left">Risk Level</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((app, idx) => (
                  <tr
                    key={app.id || app.approvalId}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-slate-800 text-cyan-400 px-2.5 py-1 rounded-lg border border-slate-700 font-bold tracking-wider">
                        {app.approvalId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(app.requester?.name || 'R')[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-white text-xs">{app.requester?.name || 'Researcher'}</div>
                          <div className="text-[10px] text-slate-500">{app.requester?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {app.queryId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400 font-medium">{app.purpose || 'RESEARCH'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={app.riskLevel} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === 'PENDING' && (role === 'ADMIN' || role === 'INSTITUTION_ADMIN') && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleProcess(app.approvalId, 'APPROVE')}
                            disabled={processingId === app.approvalId}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-800/60"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {processingId === app.approvalId ? '...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => setSelectedApproval(app)}
                            disabled={processingId === app.approvalId}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600/20 hover:bg-red-600/80 disabled:opacity-50 text-red-400 hover:text-white border border-red-700/50 rounded-lg text-xs font-bold transition-all"
                          >
                            <XCircle className="w-3 h-3" />
                            Reject
                          </button>
                        </div>
                      )}
                      {app.status === 'APPROVED' && (
                        <span className="text-[10px] text-slate-600 font-mono">Reviewed by {app.reviewedByEmail || 'Admin'}</span>
                      )}
                      {app.status === 'REJECTED' && (
                        <span className="text-[10px] text-red-600/70 font-mono">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Reject Modal ── */}
      {selectedApproval && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl shadow-red-900/30 relative overflow-hidden">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20 shrink-0">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reject Query Request</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Provide a reason for rejecting{' '}
                  <span className="text-red-400 font-mono">{selectedApproval.approvalId}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Requires refined cohort filter parameters or additional institutional clearance..."
                rows={4}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleProcess(selectedApproval.approvalId, 'REJECT')}
                disabled={processingId === selectedApproval.approvalId}
                className="px-5 py-2 bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-900/50 disabled:opacity-60"
              >
                {processingId === selectedApproval.approvalId ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
