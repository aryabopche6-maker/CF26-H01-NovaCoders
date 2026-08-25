import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileCheck, GitCommit, CheckCircle2, Lock } from 'lucide-react';
import { auditService } from '../services/auditService';

export function Auditor() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await auditService.getAuditLogs();
      setLogs(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>Auditor Compliance Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Read-only compliance verification, privacy audit trail, and cryptographic lineage tracking.
          </p>
        </div>
        <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full text-xs font-bold uppercase">
          Read-Only Auditor Access
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <span>Tamper-Evident Audit Trail</span>
        </h2>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User Email</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Query ID</th>
                  <th className="p-4">Risk</th>
                  <th className="p-4">Cryptographic Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-4 text-slate-400">{log.loggedAt || new Date().toLocaleString()}</td>
                    <td className="p-4 font-semibold text-white">{log.userEmail}</td>
                    <td className="p-4 text-cyan-400">{log.action}</td>
                    <td className="p-4 text-slate-300">{log.queryId || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.privacyRisk === 'HIGH' ? 'bg-red-950 text-red-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {log.privacyRisk || 'LOW'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 truncate max-w-xs">{log.verificationHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
