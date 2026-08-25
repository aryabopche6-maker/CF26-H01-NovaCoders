import React from 'react';
import {
  BrainCircuit,
  ShieldCheck,
  Lock,
  GitMerge,
  TableProperties,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { QUERY_STAGES } from '../../utils/constants';

export const PipelineVisualizer = ({ activeStageId, stageStates = {} }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'BrainCircuit': return BrainCircuit;
      case 'ShieldCheck': return ShieldCheck;
      case 'Lock': return Lock;
      case 'GitMerge': return GitMerge;
      case 'TableProperties': return TableProperties;
      case 'Server': return Server;
      case 'Layers': return Layers;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 my-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">
          Federated Query Execution Pipeline
        </h4>
        <span className="text-xs text-brand-400 font-mono">
          Distributed Orchestrator v2.4
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {QUERY_STAGES.map((stage, idx) => {
          const Icon = getIcon(stage.icon);
          const state = stageStates[stage.id] || { status: 'idle' };
          
          let cardBg = 'bg-slate-900/60 border-slate-800 text-slate-500';
          let iconColor = 'text-slate-600';
          let badge = null;

          if (state.status === 'running') {
            cardBg = 'bg-brand-950/40 border-brand-500/60 text-brand-300 shadow-lg shadow-brand-500/10 ring-1 ring-brand-500/40';
            iconColor = 'text-brand-400';
            badge = <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />;
          } else if (state.status === 'success') {
            cardBg = 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300';
            iconColor = 'text-emerald-400';
            badge = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
          } else if (state.status === 'warning') {
            cardBg = 'bg-amber-950/30 border-amber-500/40 text-amber-300';
            iconColor = 'text-amber-400';
            badge = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
          }

          return (
            <div
              key={stage.id}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-300 ${cardBg}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono opacity-70">0{idx + 1}</span>
                {badge}
              </div>
              <div className="my-1">
                <Icon className={`w-5 h-5 ${iconColor} mb-1.5`} />
                <p className="text-xs font-semibold leading-tight line-clamp-1">{stage.name}</p>
              </div>
              <p className="text-[10px] opacity-75 mt-1 line-clamp-2">{stage.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
