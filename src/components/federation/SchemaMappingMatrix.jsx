import React, { useState } from 'react';
import { TableProperties, Database, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { SCHEMA_MAPPING_RULES } from '../../data/schemaMappings';

export const SchemaMappingMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRules = SCHEMA_MAPPING_RULES.filter(rule =>
    rule.logicalField.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rule.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400">
            <TableProperties className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Heterogeneous Schema Mapping Matrix</h3>
            <p className="text-xs text-slate-400">
              FederateHealth automatically resolves differing database physical column names across participating hospitals into a single unified clinical domain schema.
            </p>
          </div>
        </div>

        {/* Filter Input */}
        <div className="mt-4 relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logical fields or table mappings..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:border-brand-500 outline-none"
          />
        </div>
      </div>

      {/* Schema Cards Grid */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.logicalField}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-brand-500/20 text-brand-300 font-mono font-bold text-sm border border-brand-500/40">
                  {rule.logicalField}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Logical Data Type: {rule.logicalDataType}
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                {rule.description}
              </p>
            </div>

            {/* Mappings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Hospital A Mapping */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">Hospital A (MySQL)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Mapped
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Table:</span>
                    <span className="text-slate-200 font-bold">{rule.mappings.HOSP_A.table}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Column:</span>
                    <span className="text-brand-400 font-bold">{rule.mappings.HOSP_A.column}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Type:</span>
                    <span>{rule.mappings.HOSP_A.nativeType}</span>
                  </div>
                </div>
              </div>

              {/* Hospital B Mapping */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">Hospital B (PostgreSQL)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Mapped
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Table:</span>
                    <span className="text-slate-200 font-bold">{rule.mappings.HOSP_B.table}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Column:</span>
                    <span className="text-brand-400 font-bold">{rule.mappings.HOSP_B.column}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Type:</span>
                    <span>{rule.mappings.HOSP_B.nativeType}</span>
                  </div>
                </div>
              </div>

              {/* Hospital C Mapping */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-white">Hospital C (MySQL)</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Mapped
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Table:</span>
                    <span className="text-slate-200 font-bold">{rule.mappings.HOSP_C.table}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Column:</span>
                    <span className="text-brand-400 font-bold">{rule.mappings.HOSP_C.column}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Type:</span>
                    <span>{rule.mappings.HOSP_C.nativeType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
