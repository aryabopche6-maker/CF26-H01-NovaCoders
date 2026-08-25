import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, color = 'brand' }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-700/50 shadow-glass-sm hover:shadow-glass hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 group-hover:scale-110 transition-all duration-300`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {value}
          </span>
          {trendValue && (
            <span className={`inline-flex items-center text-xs font-bold px-2 py-1 rounded-full ${
              trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : trend === 'down' ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
            </span>
          )}
        </div>
        {subtext && (
          <p className="mt-2 text-xs font-medium text-slate-500">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
