import React from 'react';
import { Sparkles, Bot, ArrowRight, Lightbulb } from 'lucide-react';

export const AiInsightCard = ({ insightText, onExplainDeep }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 my-6 relative overflow-hidden">
      {/* Decorative background badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>AI Synthesized Clinical Insight</span>
            </h4>
            <p className="text-[10px] text-indigo-300 font-mono">
              Engineered for LLM API Plugin Integration
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
          Auto Generated
        </span>
      </div>

      <div className="mt-2 text-sm text-slate-200 leading-relaxed p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="flex-1">
          {insightText || "Hospital A contributed the highest share of matching cases, representing approximately 40% of the total aggregated result. Statistical variance across sites remains within standard clinical bounds."}
        </p>
      </div>

      {onExplainDeep && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onExplainDeep}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View Full Query Lineage & Logic</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
