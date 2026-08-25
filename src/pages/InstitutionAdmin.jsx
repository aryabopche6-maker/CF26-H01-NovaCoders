import React, { useState, useEffect } from 'react';
import { Building2, Shield, Activity, Lock, Database, Power, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { institutionService } from '../services/institutionService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export function InstitutionAdmin() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [institution, setInstitution] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusReason, setStatusReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('ACTIVE');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const instId = user?.institutionId || 1;
      const instData = await institutionService.getInstitutionById(instId);
      const datasetsData = await institutionService.getDatasetPermissions(instId);
      setInstitution(instData);
      setDatasets(datasetsData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      const updated = await institutionService.updateParticipation(institution.id, targetStatus, statusReason);
      setInstitution(updated);
      addToast(`Federation participation status set to ${targetStatus}`, 'success');
      setShowStatusModal(false);
      setStatusReason('');
    } catch (error) {
      addToast(error.message || 'Failed to update participation status', 'error');
    }
  };

  const handleDatasetToggle = async (datasetCode, currentPerm) => {
    const nextPerm = currentPerm === 'ENABLED' ? 'APPROVAL_REQUIRED' : currentPerm === 'APPROVAL_REQUIRED' ? 'DISABLED' : 'ENABLED';
    try {
      await institutionService.updateDatasetPermission(institution.id, datasetCode, nextPerm);
      addToast(`Dataset ${datasetCode} permission updated to ${nextPerm}`, 'info');
      loadData();
    } catch (error) {
      addToast(error.message || 'Permission update failed', 'error');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading Institution Portal...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Institution Title */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-white">{institution?.name}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                institution?.participationStatus === 'ACTIVE' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                institution?.participationStatus === 'PAUSED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-red-950 text-red-400 border border-red-800'
              }`}>
                {institution?.participationStatus || 'ACTIVE'}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1">Region: {institution?.region} | DB Type: {institution?.databaseType}</p>
          </div>
        </div>

        {/* Participation Control Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { setTargetStatus('ACTIVE'); setShowStatusModal(true); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              institution?.participationStatus === 'ACTIVE' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ACTIVE
          </button>
          <button
            onClick={() => { setTargetStatus('PAUSED'); setShowStatusModal(true); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              institution?.participationStatus === 'PAUSED' ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            PAUSED
          </button>
        </div>
      </div>

      {/* Dataset Governance */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center space-x-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <span>Dataset Access Governance & Permissions</span>
        </h2>
        <p className="text-xs text-slate-400">Control which clinical cohorts are accessible for federated query execution.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {datasets.map((ds) => (
            <div key={ds.id || ds.datasetCode} className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">{ds.datasetName}</div>
                <div className="text-xs text-slate-400 font-mono">{ds.datasetCode}</div>
              </div>
              <button
                onClick={() => handleDatasetToggle(ds.datasetCode, ds.permission)}
                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                  ds.permission === 'ENABLED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  ds.permission === 'APPROVAL_REQUIRED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-red-950 text-red-400 border border-red-800'
                }`}
              >
                {ds.permission}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Participation Change Confirmation Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Change Federation Status to {targetStatus}?</span>
            </h3>
            <p className="text-xs text-slate-400">
              {targetStatus === 'PAUSED' ?
                'Pausing this institution will prevent it from participating in new federated queries.' :
                'Re-activating this institution will allow it to respond to federated queries.'}
            </p>
            <textarea
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="Reason (e.g. Scheduled Maintenance, Institutional Audit)"
              className="w-full h-20 p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium"
              >
                Confirm Status Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
