import React from 'react';
import { Sparkles, Search, ArrowRight, CornerDownLeft } from 'lucide-react';
import { DEMO_QUERY_TEXT } from '../../utils/constants';

export const NaturalLanguageInput = ({ value, onChange, onSubmit, isLoading, onSelectPreset }) => {
  const presets = [
    "How many diabetic patients above 40 received insulin treatment?",
    "Count patients diagnosed with Hypertension receiving Lisinopril therapy between 30 and 65.",
    "How many severe Asthma patients received Dupilumab treatment?"
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-brand-500/30 shadow-2xl relative overflow-hidden">
      {/* Subtle glowing accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-brand-400 animate-pulse" />
        <h3 className="text-base font-bold text-slate-100 dark:text-white light:text-slate-900">
          Ask Clinical Data
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 font-medium">
          Zero-Trust NLP Engine
        </span>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about participating clinical datasets across all hospitals..."
          rows={3}
          className="w-full p-4 pr-32 rounded-xl bg-slate-900/90 dark:bg-slate-900/90 light:bg-white text-slate-100 dark:text-slate-100 light:text-slate-900 border border-slate-700/80 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all resize-none text-sm font-medium placeholder-slate-500"
        />

        <button
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-brand-600 to-clinical-teal hover:from-brand-500 hover:to-clinical-teal/90 text-white font-semibold text-xs shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Query</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Preset Suggestions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Demo Queries:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPreset(preset)}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-colors text-left truncate max-w-xs"
          >
            "{preset}"
          </button>
        ))}
      </div>
    </div>
  );
};
