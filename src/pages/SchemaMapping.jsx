import React, { useState } from 'react';
import { Database, ShieldCheck, Cpu, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2, FileCode, Check, Server } from 'lucide-react';
import { SchemaMappingMatrix } from '../components/federation/SchemaMappingMatrix';
import { useFederated } from '../context/FederatedContext';
import { useToast } from '../context/ToastContext';

export const SchemaMapping = () => {
  const { logicalFields, schemaMappings, loadSchemaData, isLoadingSchemas } = useFederated();
  const { addToast } = useToast();
  const [selectedField, setSelectedField] = useState('patient_age');

  React.useEffect(() => {
    loadSchemaData();
  }, [loadSchemaData]);

  // Fallback / standard list
  const defaultFields = [
    {
      fieldName: 'patient_age',
      displayName: 'Patient Age',
      dataType: 'INTEGER',
      description: 'Standardized integer age of patient in years at time of diagnosis.'
    },
    {
      fieldName: 'condition',
      displayName: 'Clinical Condition / Diagnosis',
      dataType: 'STRING (ICD-10)',
      description: 'Primary clinical condition or disease diagnosis code.'
    },
    {
      fieldName: 'treatment',
      displayName: 'Medication / Therapy',
      dataType: 'STRING (RxNorm)',
      description: 'Prescribed medication, drug therapy, or procedure.'
    }
  ];

  const displayFields = logicalFields.length > 0 ? logicalFields : defaultFields;
  const currentField = displayFields.find(f => f.fieldName === selectedField) || displayFields[0];

  const currentMappings = schemaMappings.filter(m => m.logicalField === currentField.fieldName);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-6 h-6 text-brand-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Dynamic Schema Translation Matrix</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Canonical healthcare schema translation — maps researchers' logical query concepts to hospital-specific relational tables and fields without centralizing raw schemas.
          </p>
        </div>
        <button
          onClick={() => {
            loadSchemaData();
            addToast('Schema definitions refreshed', 'info');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSchemas ? 'animate-spin' : ''}`} />
          <span>Refresh Schemas</span>
        </button>
      </div>

      {/* Dynamic Translation Architecture Banner */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-brand-500/30 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2 text-brand-300 font-bold text-xs uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-brand-400" />
          <span>Canonical Schema Translation Engine</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Researchers query against standard canonical fields (<code className="text-brand-300 font-mono">patient_age</code>, <code className="text-brand-300 font-mono">condition</code>, <code className="text-brand-300 font-mono">treatment</code>). The system dynamically translates filters into local SQL for each institution while protecting against unmapped field execution.
        </p>
      </div>

      {/* Canonical Field Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayFields.map((field) => (
          <button
            key={field.fieldName}
            onClick={() => setSelectedField(field.fieldName)}
            className={`p-4 text-left rounded-2xl border transition-all ${
              selectedField === field.fieldName
                ? 'bg-slate-900 border-brand-500/60 shadow-lg shadow-brand-500/10'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">{field.displayName || field.fieldName}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-brand-300">{field.dataType}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 line-clamp-2">{field.description}</p>
            <div className="mt-3 flex items-center space-x-2 text-[10px] font-mono text-emerald-400 font-bold">
              <Check className="w-3 h-3" />
              <span>Canonical Symbol: {field.fieldName}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Field Mapping Breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-extrabold text-white text-base">Mapped Fields for `{currentField.fieldName}`</h3>
            <p className="text-xs text-slate-400 mt-0.5">Translation confidence score and safety guards per hospital node</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-mono text-xs font-bold border border-brand-500/30">
            Avg Confidence: 97%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentMappings.length > 0 ? (
            currentMappings.map((mapping) => (
              <div
                key={mapping.id || mapping.institutionId}
                className="p-4 rounded-xl border bg-slate-950 border-slate-800 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 text-xs">{mapping.institutionName || `Hospital ${mapping.institutionId}`}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[10px] font-bold">
                    {mapping.confidenceScore || 96}% MATCH
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Local Table:</span>
                    <span className="text-slate-200 font-bold">{mapping.localTable}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Local Column:</span>
                    <span className="text-brand-300 font-bold">{mapping.localColumn}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>Type:</span>
                    <span>{mapping.nativeType}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-6 text-slate-400 text-xs">
              Fetching dynamic mappings from SchemaMappingController...
            </div>
          )}
        </div>
      </div>

      {/* Static Matrix Breakdown */}
      <SchemaMappingMatrix />
    </div>
  );
};
