import React from 'react';
import { HelpCircle, BrainCircuit, TableProperties, Server, Layers, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export const QueryExplanation = () => {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-brand-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Explain This Query Logic
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Detailed technical explanation of natural language parsing, local SQL translation, and scalar result synthesis.
        </p>
      </div>

      {/* Question Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-500/40 bg-slate-900 space-y-4">
        <div>
          <span className="text-[10px] text-brand-400 font-bold uppercase tracking-widest">Natural Language User Input</span>
          <h3 className="text-xl font-bold text-white mt-1">"How many diabetic patients above 40 received insulin treatment?"</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block">Condition:</span>
            <span className="font-bold text-white">Diabetes</span>
          </div>
          <div>
            <span className="text-slate-400 block">Age Constraint:</span>
            <span className="font-bold text-emerald-400">&gt; 40</span>
          </div>
          <div>
            <span className="text-slate-400 block">Treatment:</span>
            <span className="font-bold text-indigo-400">Insulin</span>
          </div>
          <div>
            <span className="text-slate-400 block">Aggregation:</span>
            <span className="font-bold text-amber-400">COUNT</span>
          </div>
        </div>
      </div>

      {/* Step by Step Translation */}
      <div className="space-y-6">
        {/* Step 1: Schema Mapping Applied */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-brand-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              1. Applied Heterogeneous Schema Mappings
            </h4>
          </div>

          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Logical Field</th>
                  <th className="p-3">Hospital A (MySQL)</th>
                  <th className="p-3">Hospital B (PostgreSQL)</th>
                  <th className="p-3">Hospital C (MySQL)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/60 font-mono">
                <tr>
                  <td className="p-3 font-bold text-brand-300">Diagnosis</td>
                  <td className="p-3 text-slate-200">disease</td>
                  <td className="p-3 text-slate-200">condition</td>
                  <td className="p-3 text-slate-200">diagnosis</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-300">Treatment</td>
                  <td className="p-3 text-slate-200">treatment</td>
                  <td className="p-3 text-slate-200">therapy</td>
                  <td className="p-3 text-slate-200">medication</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-brand-300">Age</td>
                  <td className="p-3 text-slate-200">age</td>
                  <td className="p-3 text-slate-200">age_years</td>
                  <td className="p-3 text-slate-200">patient_age</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Step 2: Local SQL Execution */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              2. Local SQL Sub-Queries Executed Inside Firewall
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Hospital A</span>
              <pre className="text-[11px] font-mono text-brand-300 bg-slate-900 p-2 rounded">
                SELECT COUNT(*) FROM patients p JOIN treatments t ON p.id = t.patient_id WHERE p.disease = 'Diabetes' AND p.age &gt; 40 AND t.treatment = 'Insulin';
              </pre>
              <span className="text-emerald-400 font-mono font-bold block pt-1">Returned: 120</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Hospital B</span>
              <pre className="text-[11px] font-mono text-brand-300 bg-slate-900 p-2 rounded">
                SELECT COUNT(*) FROM clinical_cohort c JOIN medication_log m ON c.ref = m.ref WHERE c.condition = 'Diabetes' AND c.age_years &gt; 40 AND m.therapy = 'Insulin';
              </pre>
              <span className="text-emerald-400 font-mono font-bold block pt-1">Returned: 85</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-white block">Hospital C</span>
              <pre className="text-[11px] font-mono text-brand-300 bg-slate-900 p-2 rounded">
                SELECT COUNT(*) FROM patient_master pm JOIN pharmacy_dispense pd ON pm.num = pd.num WHERE pm.diagnosis = 'Diabetes' AND pm.patient_age &gt; 40 AND pd.medication = 'Insulin';
              </pre>
              <span className="text-emerald-400 font-mono font-bold block pt-1">Returned: 95</span>
            </div>
          </div>
        </div>

        {/* Step 3: Mathematical Summation */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              3. Final Mathematical Aggregation
            </h4>
            <p className="text-sm font-mono font-bold text-white mt-1">
              120 (Hospital A) + 85 (Hospital B) + 95 (Hospital C) = <span className="text-emerald-400 text-2xl">300</span>
            </p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
