import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, BrainCircuit, ShieldCheck, RefreshCw, AlertTriangle, ArrowRight, AlertCircle, FileText, CheckCircle2, Award, Lock, Key } from 'lucide-react';
import { NaturalLanguageInput } from '../components/query/NaturalLanguageInput';
import { PipelineVisualizer } from '../components/query/PipelineVisualizer';
import { ExecutionFlowDiagram } from '../components/query/ExecutionFlowDiagram';
import { PrivacyRiskCard } from '../components/query/PrivacyRiskCard';
import { ResultCard } from '../components/query/ResultCard';
import { AiInsightCard } from '../components/query/AiInsightCard';
import { ContributionChart } from '../components/charts/ContributionChart';
import { QueryFirewallCard } from '../components/firewall/QueryFirewallCard';
import { PrivacyBudgetCard } from '../components/privacy/PrivacyBudgetCard';
import { ClinicalQueryPassportModal } from '../components/passport/ClinicalQueryPassportModal';
import { queryService } from '../services/queryService';
import { useFederated } from '../context/FederatedContext';
import { useToast } from '../context/ToastContext';
import { DEMO_QUERY_TEXT } from '../utils/constants';

export const AskClinicalData = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { executeQuery, activeQueryResult, setActiveQueryResult } = useFederated();

  const [queryText, setQueryText] = useState(DEMO_QUERY_TEXT);
  const [queryMode, setQueryMode] = useState('NORMAL'); // NORMAL, EMERGENCY
  const [emergencyReason, setEmergencyReason] = useState('');
  const [emergencyDescription, setEmergencyDescription] = useState('');
  const [purpose, setPurpose] = useState('RESEARCH');
  const [isLoading, setIsLoading] = useState(false);
  const [parsedQuery, setParsedQuery] = useState(null);
  const [stageStates, setStageStates] = useState({});
  const [isSimulatingFailure, setIsSimulatingFailure] = useState(false);
  const [remainingEpsilon, setRemainingEpsilon] = useState(9.5);

  const [overridePin, setOverridePin] = useState('');
  const [isOverriding, setIsOverriding] = useState(false);

  // Passport Modal State
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  React.useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      handleRunQuery(DEMO_QUERY_TEXT, false);
    }
  }, [searchParams]);

  const handleRunQuery = async (promptToRun = queryText, simulateFail = isSimulatingFailure, bypassQueryId = null, bypassApprovalId = null) => {
    if (!promptToRun.trim()) return;

    if (queryMode === 'EMERGENCY' && (!emergencyReason || !emergencyDescription)) {
      addToast('Please provide an Emergency Reason and Description before submitting an Emergency Analytics query.', 'warning');
      return;
    }

    setIsLoading(true);
    if (!bypassQueryId) setActiveQueryResult(null);
    setStageStates({});

    try {
      let parsed = parsedQuery;
      if (!bypassQueryId) {
        try {
          parsed = await queryService.parseNaturalLanguage(promptToRun);
          setParsedQuery(parsed);
        } catch (parseErr) {
          // If AI parse fails, use a simple fallback
          parsed = parsed || { condition: 'diabetes', treatment: 'insulin', ageOperator: '>', age: 40, gender: null };
          if (!parsedQuery) setParsedQuery(parsed);
        }
      }
      // Safety: if parsed is still null (e.g., bypassQueryId set before first query ran)
      if (!parsed) {
        parsed = { condition: null, treatment: null, ageOperator: '>', age: 40, gender: null };
      }

      // Step 2: Execute query via context & Spring Boot backend API
      const result = await executeQuery({
        queryId: bypassQueryId,
        approvalId: bypassApprovalId,
        rawQuestion: promptToRun,
        condition: parsed.condition,
        treatment: parsed.treatment,
        ageOperator: parsed.ageOperator || '>',
        age: parsed.age || 40,
        gender: parsed.gender,
        aggregation: 'COUNT',
        queryMode,
        emergencyReason,
        emergencyDescription,
        purpose
      });

      // Transform backend response for visualization components
      const formattedResult = {
        id: result.queryId,
        queryId: result.queryId,
        status: result.status,
        totalResult: result.totalPatients ?? result.totalResult,
        completeness: result.completeness,
        privacyRisk: result.privacyRisk,
        executionTimeMs: result.executionTimeMs,
        queryMode: result.queryMode,
        aiInsight: result.aiInsight,
        firewallDecision: result.firewallDecision || {
          decision: result.status === 'BLOCKED' ? 'BLOCK' : 'ALLOW',
          riskLevel: result.privacyRisk || 'LOW',
          reIdentRiskScore: result.status === 'BLOCKED' ? 88 : 12,
          reasons: result.status === 'BLOCKED'
            ? ['Highly specific demographic and clinical filters present a re-identification risk.']
            : ['Query passed pre-execution privacy firewall checks.'],
          specificFiltersChecked: ['Condition', 'Age Criteria', 'Treatment'],
          requiresApproval: result.status === 'PENDING_APPROVAL'
        },
        passport: result.passport,
        approvalId: result.approvalId,
        breakdown: (result.institutionBreakdown || []).map(b => ({
          institutionCode: b.institutionCode,
          institutionName: b.institutionName,
          count: b.count,
          status: b.status,
          executionTimeMs: b.executionTimeMs,
          error: b.error
        }))
      };

      setActiveQueryResult(formattedResult);
      setRemainingEpsilon(prev => Math.max(0, prev - 0.5));

      if (result.status === 'BLOCKED') {
        addToast(`Query blocked by Privacy Firewall (High Re-Identification Risk)`, 'error');
      } else if (result.status === 'PENDING_APPROVAL') {
        addToast(`Query requires approval (Approval ID: ${result.approvalId})`, 'warning');
      } else {
        addToast(`Federated Query ${result.queryId} completed successfully!`, 'success');
      }
    } catch (err) {
      addToast(err.message || "Error during query execution.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverride = async () => {
    if (!overridePin) return;
    setIsOverriding(true);
    try {
      await queryService.overrideApproval(activeQueryResult.approvalId, overridePin);
      addToast('Override successful! Executing query...', 'success');
      setOverridePin('');
      
      // Re-run query with queryId and approvalId
      await handleRunQuery(queryText, isSimulatingFailure, activeQueryResult.queryId, activeQueryResult.approvalId);
    } catch (err) {
      addToast(err.message || 'Failed to override approval', 'error');
    } finally {
      setIsOverriding(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Ask Clinical Data
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold border border-brand-500/30">
              NLP Query Engine
            </span>
          </div>

          {activeQueryResult && (
            <button
              onClick={() => setIsPassportOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 border border-brand-500/40 text-xs font-bold transition shadow-lg animate-pulse"
            >
              <Award className="w-4 h-4 text-brand-400" />
              <span>View Clinical Query Passport 🛂</span>
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Ask natural language questions across participating institutions without moving raw patient records.
        </p>
      </div>

      {/* Privacy Budget Card */}
      <PrivacyBudgetCard remainingEpsilon={remainingEpsilon} totalEpsilon={10.0} cost={0.5} />

      {/* Query Options Panel (Query Mode & Research Purpose) */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Query Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Query Mode</label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setQueryMode('NORMAL')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 border ${
                  queryMode === 'NORMAL' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 shadow' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Normal Analytics</span>
              </button>
              <button
                type="button"
                onClick={() => setQueryMode('EMERGENCY')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-2 border ${
                  queryMode === 'EMERGENCY' ? 'bg-amber-950 text-amber-300 border-amber-500/50 shadow' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Emergency Analytics</span>
              </button>
            </div>
          </div>

          {/* Purpose Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Research Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-medium"
            >
              <option value="RESEARCH">CLINICAL RESEARCH</option>
              <option value="CLINICAL_STUDY">CLINICAL STUDY / TRIAL</option>
              <option value="PUBLIC_HEALTH">PUBLIC HEALTH SURVEILLANCE</option>
              <option value="INSTITUTIONAL_ANALYTICS">INSTITUTIONAL ANALYTICS</option>
            </select>
          </div>
        </div>

        {/* Emergency Mode Parameters */}
        {queryMode === 'EMERGENCY' && (
          <div className="p-4 bg-amber-950/30 border border-amber-700/50 rounded-xl space-y-3 animate-fade-in">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase">
              <AlertCircle className="w-4 h-4" />
              <span>Emergency Query Protocol Enabled</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Emergency Mode requires mandatory justification and triggers high-priority compliance audit logs. Minimum group-size privacy protection (k=10) still strictly applies.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Emergency Reason (e.g. Public Health Outbreak Surveillance)"
                value={emergencyReason}
                onChange={(e) => setEmergencyReason(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-amber-800/60 rounded-lg text-xs text-amber-100 placeholder-amber-500/60 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Detailed Description / Authorization ID"
                value={emergencyDescription}
                onChange={(e) => setEmergencyDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-amber-800/60 rounded-lg text-xs text-amber-100 placeholder-amber-500/60 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Component */}
      <NaturalLanguageInput
        value={queryText}
        onChange={setQueryText}
        onSubmit={() => handleRunQuery(queryText, isSimulatingFailure)}
        isLoading={isLoading}
        onSelectPreset={(preset) => {
          setQueryText(preset);
          handleRunQuery(preset, isSimulatingFailure);
        }}
      />

      {/* AI Query Understanding Breakdown */}
      {parsedQuery && (
        <div className="glass-panel p-5 rounded-2xl border border-brand-500/40 bg-brand-950/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Query Understanding
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Condition</span>
              <span className="font-bold text-brand-300 text-sm">{parsedQuery.condition}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Age Criteria</span>
              <span className="font-bold text-emerald-400 text-sm">{parsedQuery.ageOperator} {parsedQuery.age}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Treatment</span>
              <span className="font-bold text-indigo-300 text-sm">{parsedQuery.treatment}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase">Operation</span>
              <span className="font-bold text-amber-300 text-sm">COUNT</span>
            </div>
          </div>
        </div>
      )}

      {/* Query Firewall Card Pre-Execution Step */}
      {activeQueryResult?.firewallDecision && (
        <QueryFirewallCard decision={activeQueryResult.firewallDecision} />
      )}

      {/* Visual Execution Pipeline */}
      {(isLoading || activeQueryResult) && (
        <PipelineVisualizer stageStates={stageStates} />
      )}

      {/* Privacy Risk Assessment Card */}
      {activeQueryResult && activeQueryResult.status !== 'PENDING_APPROVAL' && (
        <PrivacyRiskCard risk={activeQueryResult.privacyRisk} />
      )}

      {/* Admin PIN Override Section */}
      {activeQueryResult && activeQueryResult.status === 'PENDING_APPROVAL' && (
        <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 shadow-2xl shadow-amber-900/20 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500"></div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-300">Supervisor Authorization Required</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-xl">
                  This query poses a HIGH re-identification risk and has been blocked by the privacy firewall. 
                  An administrator can authorize this query immediately by entering their override PIN.
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-xs text-amber-500/70 uppercase tracking-widest font-bold">Approval ID:</span>
                  <span className="text-xs text-slate-300 font-mono bg-slate-950 px-2 py-1 rounded border border-slate-800">{activeQueryResult.approvalId}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col items-center">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Admin Override PIN
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Enter PIN (e.g. 1234)"
                  value={overridePin}
                  onChange={(e) => setOverridePin(e.target.value)}
                  className="w-40 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-center text-white font-mono tracking-widest focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  maxLength={4}
                />
                <button
                  onClick={handleOverride}
                  disabled={!overridePin || isOverriding}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                    !overridePin || isOverriding
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-900/50'
                  }`}
                >
                  {isOverriding ? 'Authorizing...' : 'Authorize'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Primary Result & Failure Simulation */}
      {activeQueryResult && activeQueryResult.status !== 'BLOCKED' && activeQueryResult.status !== 'PENDING_APPROVAL' && (
        <>
          <ResultCard
            result={activeQueryResult}
            isSimulatingFailure={isSimulatingFailure}
            onToggleFailure={() => setIsSimulatingFailure(!isSimulatingFailure)}
            onRetry={() => handleRunQuery(queryText, false)}
          />

          {/* Key Hackathon Federated Architecture Diagram */}
          <ExecutionFlowDiagram
            breakdown={activeQueryResult.breakdown}
            totalResult={activeQueryResult.totalResult}
            isPartial={activeQueryResult.status === 'PARTIAL'}
          />

          {/* Chart & AI Insight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ContributionChart breakdown={activeQueryResult.breakdown} />
            </div>
            <div>
              <AiInsightCard
                insightText={activeQueryResult.aiInsight}
                onExplainDeep={() => setIsPassportOpen(true)}
              />
            </div>
          </div>
        </>
      )}

      {/* Passport Modal */}
      <ClinicalQueryPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        passport={activeQueryResult?.passport}
        queryResult={activeQueryResult}
      />
    </div>
  );
};
