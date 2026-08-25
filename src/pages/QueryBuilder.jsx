import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sliders, Code, Play, Eye, Database, CheckSquare, Square } from 'lucide-react';
import { executeFederatedQuery } from '../services/queryService';
import { ResultCard } from '../components/query/ResultCard';
import { ExecutionFlowDiagram } from '../components/query/ExecutionFlowDiagram';
import { useToast } from '../context/ToastContext';

export const QueryBuilder = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [condition, setCondition] = useState('Diabetes');
  const [treatment, setTreatment] = useState('Insulin');
  const [ageOperator, setAgeOperator] = useState('>');
  const [ageValue, setAgeValue] = useState(40);
  const [gender, setGender] = useState('ALL');
  const [aggregation, setAggregation] = useState('COUNT');
  const [selectedInsts, setSelectedInsts] = useState(['hosp-a', 'hosp-b', 'hosp-c']);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executedResult, setExecutedResult] = useState(null);

  const toggleInst = (id) => {
    setSelectedInsts(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const generateSqlPreview = () => {
    return `SELECT ${aggregation}(patient_id) \nFROM clinical_fabric \nWHERE diagnosis = '${condition}' \n  AND age ${ageOperator} ${ageValue} \n  AND treatment = '${treatment}' \n  ${gender !== 'ALL' ? `AND gender = '${gender}' \n` : ''}GROUP BY federated_site;`;
  };

  const handleExecute = async () => {
    if (selectedInsts.length === 0) {
      addToast("Please select at least 1 participating institution.", 'warning');
      return;
    }

    setIsExecuting(true);
    try {
      const mockParsed = {
        rawPrompt: `Structured Query: ${condition} + ${treatment} (Age ${ageOperator} ${ageValue})`,
        parsed: {
          condition,
          treatment,
          age: `${ageOperator} ${ageValue}`,
          minAge: ageValue,
          maxAge: 120,
          gender,
          operation: aggregation
        }
      };

      const res = await executeFederatedQuery({
        parsedQuery: mockParsed,
        institutions: selectedInsts,
        simulateFailure: false
      });

      setExecutedResult(res);
      addToast("Federated Query executed from Query Builder!", 'success');
    } catch (err) {
      addToast("Execution failed.", 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <Sliders className="w-6 h-6 text-brand-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Visual Federated Query Builder
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Construct structured, precise federated clinical queries using explicit filters and aggregation controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Query Form Controls */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Query Criteria Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Condition Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Clinical Diagnosis / Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:border-brand-500 outline-none"
              >
                <option value="Diabetes">Diabetes Mellitus (Type 2)</option>
                <option value="Hypertension">Hypertension</option>
                <option value="Cancer">Oncology / Malignancy</option>
                <option value="Asthma">Severe Asthma</option>
                <option value="Heart Disease">Ischemic Heart Disease</option>
              </select>
            </div>

            {/* Treatment Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Medication / Biologic Therapy
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:border-brand-500 outline-none"
              >
                <option value="Insulin">Insulin Human Regular</option>
                <option value="Lisinopril">Lisinopril (ACE Inhibitor)</option>
                <option value="Immunotherapy">PD-1 Immunotherapy</option>
                <option value="Dupilumab">Dupilumab (IL-4 Monoclonal)</option>
                <option value="Statin">Atorvastatin Statin</option>
              </select>
            </div>

            {/* Age Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Patient Age Threshold
              </label>
              <div className="flex gap-2">
                <select
                  value={ageOperator}
                  onChange={(e) => setAgeOperator(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none w-20"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="=">=</option>
                </select>
                <input
                  type="number"
                  value={ageValue}
                  onChange={(e) => setAgeValue(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 outline-none"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gender Filter
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:border-brand-500 outline-none"
              >
                <option value="ALL">All Genders</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          {/* Institution Selector Checkboxes */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Target Participating Institutions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'hosp-a', name: 'Hospital A (St. Jude)' },
                { id: 'hosp-b', name: 'Hospital B (Metropolitan)' },
                { id: 'hosp-c', name: 'Hospital C (Valley Academic)' }
              ].map((inst) => {
                const checked = selectedInsts.includes(inst.id);
                return (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => toggleInst(inst.id)}
                    className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
                      checked
                        ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {checked ? <CheckSquare className="w-4 h-4 text-brand-400 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{inst.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aggregation Function */}
          <div className="pt-4 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Aggregation Function
            </label>
            <div className="flex gap-3">
              {['COUNT', 'AVG', 'SUM'].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setAggregation(op)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    aggregation === op
                      ? 'bg-brand-600 text-white shadow-lg'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-clinical-teal hover:from-brand-500 hover:to-clinical-teal text-white font-bold text-xs shadow-xl shadow-brand-500/20 disabled:opacity-50 transition-all transform hover:scale-[1.02]"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching to 3 Nodes...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Execute Federated Query</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right 1 Col: Live SQL Preview */}
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Logical SQL AST Preview
              </h4>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-brand-300 border border-slate-800 overflow-x-auto leading-relaxed">
              {generateSqlPreview()}
            </pre>

            <p className="text-[11px] text-slate-400">
              This logical query is compiled locally at each hospital into native dialect queries (MySQL 8.0 & PostgreSQL 15).
            </p>
          </div>
        </div>
      </div>

      {/* Results View */}
      {executedResult && (
        <div className="mt-8 space-y-6">
          <ResultCard result={executedResult} />
          <ExecutionFlowDiagram
            breakdown={executedResult.breakdown}
            totalResult={executedResult.totalResult}
          />
        </div>
      )}
    </div>
  );
};
