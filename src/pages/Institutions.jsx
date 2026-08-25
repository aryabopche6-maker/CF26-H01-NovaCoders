import React, { useState } from 'react';
import { Building2, Shield, Activity, PauseCircle, PlayCircle, AlertOctagon, RefreshCw, Plus } from 'lucide-react';
import { useFederated } from '../context/FederatedContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';

export const Institutions = () => {
  const { institutions, isLoadingInstitutions, loadInstitutions, updateInstitutionStatus, addInstitution } = useFederated();
  const { role } = useAuth();
  const { addToast } = useToast();
  const [selectedInst, setSelectedInst] = useState(null);
  const [newStatus, setNewStatus] = useState('ACTIVE');
  const [statusReason, setStatusReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Hospital modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newHospital, setNewHospital] = useState({
    code: '', name: '', region: '', databaseType: 'MYSQL', complianceInfo: 'HIPAA Compliant'
  });

  const handleOpenStatusModal = (inst) => {
    setSelectedInst(inst);
    setNewStatus(inst.participationStatus || 'ACTIVE');
    setStatusReason('');
  };

  const handleUpdateStatus = async () => {
    if (!selectedInst || !statusReason.trim()) {
      addToast('Please provide a reason for updating participation status.', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      await updateInstitutionStatus(selectedInst.id, newStatus, statusReason);
      setSelectedInst(null);
    } catch (err) {
      // Toast handled by context
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold inline-flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" /> ACTIVE</span>;
      case 'PAUSED':
        return <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-mono font-bold inline-flex items-center gap-1"><PauseCircle className="w-3.5 h-3.5" /> PAUSED</span>;
      case 'SUSPENDED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 text-xs font-mono font-bold inline-flex items-center gap-1"><AlertOctagon className="w-3.5 h-3.5" /> SUSPENDED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-700 text-xs font-mono font-bold">ACTIVE</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Federation Participating Institutions</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Governance & Participation Control — Manage local node status (ACTIVE, PAUSED, SUSPENDED) and dataset permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(role === 'ADMIN') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hospital</span>
            </button>
          )}
          <button
            onClick={() => {
              loadInstitutions();
              addToast('Institution status updated', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInstitutions ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {institutions.map((inst) => (
          <div key={inst.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-brand-400 font-bold uppercase">{inst.code}</span>
                  <h3 className="font-extrabold text-white text-base mt-0.5">{inst.name}</h3>
                  <span className="text-xs text-slate-400 block">{inst.type || 'Academic Medical Center'}</span>
                </div>
                {getStatusBadge(inst.participationStatus)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Database Engine</span>
                  <span className="font-mono text-slate-200 font-semibold">{inst.databaseType || 'MySQL'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Quality Score</span>
                  <span className="font-mono text-emerald-400 font-bold">{inst.dataQualityScore || 98}%</span>
                </div>
              </div>

              {inst.participationStatus === 'PAUSED' && (
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-200 text-xs">
                  <span className="font-bold block">PAUSED NODE:</span>
                  Skips new federated queries automatically until status is restored to ACTIVE.
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => handleOpenStatusModal(inst)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition text-center"
              >
                Manage Federation Participation ⚙️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Participation Status Modal */}
      {selectedInst && (
        <Modal
          isOpen={!!selectedInst}
          onClose={() => setSelectedInst(null)}
          title={`Participation Control — ${selectedInst.name}`}
        >
          <div className="space-y-4 text-xs text-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Select Participation Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'ACTIVE', label: 'ACTIVE', color: 'bg-emerald-950 text-emerald-300 border-emerald-500/50' },
                  { key: 'PAUSED', label: 'PAUSED', color: 'bg-amber-950 text-amber-300 border-amber-500/50' },
                  { key: 'SUSPENDED', label: 'SUSPENDED', color: 'bg-rose-950 text-rose-300 border-rose-500/50' },
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setNewStatus(s.key)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                      newStatus === s.key ? `${s.color} ring-2 ring-brand-500/50` : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Reason for Status Change (Mandatory Audit Requirement)
              </label>
              <textarea
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="e.g. Scheduled local EHR maintenance window from 02:00 to 06:00 UTC."
                rows={3}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedInst(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-slate-950 font-bold text-xs transition"
              >
                {isUpdating ? 'Updating...' : 'Confirm Status Change'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Hospital Modal */}
      {showAddModal && (
        <Modal title="Add New Federation Hospital" onClose={() => setShowAddModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Institution Code</label>
                <input
                  type="text"
                  value={newHospital.code}
                  onChange={e => setNewHospital({...newHospital, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. HOSP_D"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Institution Name</label>
                <input
                  type="text"
                  value={newHospital.name}
                  onChange={e => setNewHospital({...newHospital, name: e.target.value})}
                  placeholder="e.g. General Hospital"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Region</label>
              <input
                type="text"
                value={newHospital.region}
                onChange={e => setNewHospital({...newHospital, region: e.target.value})}
                placeholder="e.g. North America - East"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Database Type</label>
                <select
                  value={newHospital.databaseType}
                  onChange={e => setNewHospital({...newHospital, databaseType: e.target.value})}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="MYSQL">MySQL</option>
                  <option value="POSTGRESQL">PostgreSQL</option>
                  <option value="ORACLE">Oracle DB</option>
                  <option value="SQLSERVER">SQL Server</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Compliance Info</label>
                <input
                  type="text"
                  value={newHospital.complianceInfo}
                  onChange={e => setNewHospital({...newHospital, complianceInfo: e.target.value})}
                  placeholder="e.g. HIPAA Compliant"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if(!newHospital.code || !newHospital.name) {
                    addToast('Code and Name are required', 'warning');
                    return;
                  }
                  setIsAdding(true);
                  try {
                    await addInstitution(newHospital);
                    setShowAddModal(false);
                    setNewHospital({code: '', name: '', region: '', databaseType: 'MYSQL', complianceInfo: 'HIPAA Compliant'});
                  } catch (e) {
                     // Error handled
                  } finally {
                    setIsAdding(false);
                  }
                }}
                disabled={isAdding}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30"
              >
                {isAdding ? 'Adding...' : 'Add Hospital'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
