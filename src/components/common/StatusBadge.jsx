import React from 'react';

export const StatusBadge = ({ status, text, size = 'md' }) => {
  const normalized = status ? status.toLowerCase() : 'online';
  
  let bg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let dotBg = 'bg-emerald-400';
  let label = text || 'Online';

  if (normalized === 'slow' || normalized === 'degraded' || normalized === 'partial' || normalized === 'warning') {
    bg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotBg = 'bg-amber-400 animate-pulse';
    label = text || 'Slow Latency';
  } else if (normalized === 'offline' || normalized === 'failed' || normalized === 'error') {
    bg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotBg = 'bg-rose-400';
    label = text || 'Offline';
  } else if (normalized === 'low') {
    bg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotBg = 'bg-emerald-400';
    label = text || 'LOW RISK';
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`} />
      {label}
    </span>
  );
};
