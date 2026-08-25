import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sliders, Code, Play, Eye, Database, CheckSquare, Square } from 'lucide-react';
import { executeFederatedQuery } from '../services/queryService';
import { ResultCard } from '../components/query/ResultCard';
import { ExecutionFlowDiagram } from '../components/query/ExecutionFlowDiagram';
import { useToast } from '../context/ToastContext';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
            <Sliders className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm">
            Visual Federated Query Builder
          </h1>
        </div>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Construct structured, precise federated clinical queries using explicit filters and aggregation controls.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Query Form Controls */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-6 md:p-8 rounded-2xl border border-slate-700/50 shadow-glass-sm space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-700/50 pb-4">
            <Database className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Query Criteria Setup
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Condition Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Clinical Diagnosis
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 text-sm font-medium text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none transition-all shadow-inner"
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
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Therapy / Medication
              </label>
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 text-sm font-medium text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none transition-all shadow-inner"
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
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Patient Age
              </label>
              <div className="flex gap-3">
                <select
                  value={ageOperator}
                  onChange={(e) => setAgeOperator(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 text-sm font-medium text-slate-100 outline-none w-24 text-center transition-all shadow-inner"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="=">=</option>
                </select>
                <input
                  type="number"
                  value={ageValue}
                  onChange={(e) => setAgeValue(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 text-sm font-medium text-slate-100 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Gender Filter
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-brand-500/50 text-sm font-medium text-slate-100 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 outline-none transition-all shadow-inner"
              >
                <option value="ALL">All Genders</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>

          {/* Institution Selector Checkboxes */}
          <div className="pt-6 border-t border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Target Participating Institutions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'hosp-a', name: 'Hospital A (St. Jude)' },
                { id: 'hosp-b', name: 'Hospital B (Metropolitan)' },
                { id: 'hosp-c', name: 'Hospital C (Valley Academic)' }
              ].map((inst) => {
                const checked = selectedInsts.includes(inst.id);
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={inst.id}
                    type="button"
                    onClick={() => toggleInst(inst.id)}
                    className={`p-3.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-3 transition-all ${
                      checked
                        ? 'bg-brand-500/20 text-brand-300 border-brand-500/50 shadow-glow'
                        : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:border-brand-500/30 hover:bg-slate-800/80'
                    }`}
                  >
                    {checked ? <CheckSquare className="w-5 h-5 text-brand-400 shrink-0" /> : <Square className="w-5 h-5 shrink-0" />}
                    <span className="truncate">{inst.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Aggregation Function */}
          <div className="pt-6 border-t border-slate-700/50">
            <label className="block text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Aggregation Function
            </label>
            <div className="flex flex-wrap gap-3">
              {['COUNT', 'AVG', 'SUM'].map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setAggregation(op)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    aggregation === op
                      ? 'bg-gradient-to-r from-brand-600 to-clinical-teal text-white shadow-glow border border-transparent'
                      : 'bg-slate-900/50 text-slate-400 border border-slate-700/50 hover:text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-6 flex items-center justify-end gap-3 border-t border-slate-700/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-clinical-teal text-white font-bold text-sm shadow-glow disabled:opacity-50 transition-all border border-brand-400/30"
            >
              {isExecuting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Dispatching to Nodes...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Execute Federated Query</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Right 1 Col: Live SQL Preview */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-brand-500/20 space-y-4 shadow-glass-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-2 relative z-10">
              <Code className="w-5 h-5 text-brand-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Logical SQL AST Preview
              </h4>
            </div>

            <pre className="p-5 rounded-xl bg-slate-950/80 font-mono text-sm text-brand-300 border border-slate-700/50 overflow-x-auto leading-relaxed shadow-inner relative z-10">
              {generateSqlPreview()}
            </pre>

            <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
              This logical query is compiled locally at each hospital into native dialect queries (MySQL 8.0 & PostgreSQL 15).
            </p>
          </div>
        </motion.div>
      </div>

      {/* Results View */}
      {executedResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-8"
        >
          <ResultCard result={executedResult} />
          <ExecutionFlowDiagram
            breakdown={executedResult.breakdown}
            totalResult={executedResult.totalResult}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
