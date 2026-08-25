import React from 'react';
import { Modal } from '../common/Modal';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ExplainPrivacyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Risk Audit & Compliance Model" maxWidth="max-w-3xl">
      <div className="space-y-6 text-sm text-slate-200">
        {/* Intro Banner */}
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-emerald-300">Why this Query is Rated LOW Privacy Risk</h4>
            <p className="text-xs text-slate-300 mt-1">
              FederateHealth uses a zero-trust privacy engine combining mathematical k-anonymity, differential privacy noise injection, and localized SQL compilation to ensure HIPAA / GDPR compliance.
            </p>
          </div>
        </div>

        {/* 3 Privacy Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white">1. Zero Raw Data Movement</h5>
            <p className="text-xs text-slate-400">
              No patient PHI, EHR IDs, names, or addresses ever leave the hospital firewall. Only scalar mathematical integers are returned.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white">2. k-Anonymity (k &ge; 10)</h5>
            <p className="text-xs text-slate-400">
              If a local cohort yields fewer than 10 matching records, the query automatically suppresses the output to prevent re-identification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="p-2 w-fit rounded-lg bg-clinical-teal/20 text-clinical-teal">
              <EyeOff className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white">3. Differential Privacy</h5>
            <p className="text-xs text-slate-400">
              Laplacian noise is added to edge case aggregates to guarantee that presence of a single individual cannot be inferred.
            </p>
          </div>
        </div>

        {/* Audit Verification Rules Table */}
        <div>
          <h5 className="font-bold text-white mb-2">Automated Privacy Guard Verification Matrix</h5>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3 font-semibold">Privacy Rule</th>
                  <th className="p-3 font-semibold">Target Threshold</th>
                  <th className="p-3 font-semibold">Evaluated Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                <tr>
                  <td className="p-3 font-medium text-slate-200">Aggregate Count Minimum</td>
                  <td className="p-3 font-mono text-slate-400">COUNT &ge; 10</td>
                  <td className="p-3 text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed (Result = 300)
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-200">Patient Identifier Projection</td>
                  <td className="p-3 font-mono text-slate-400">EXCLUDE (ssn, ehr_id, name)</td>
                  <td className="p-3 text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Enforced at Compiler
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-slate-200">Cross-Site Join Leakage</td>
                  <td className="p-3 font-mono text-slate-400">Zero Patient Keys Exchanged</td>
                  <td className="p-3 text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
