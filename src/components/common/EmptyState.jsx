import React from 'react';
import { Database, Search } from 'lucide-react';

export const EmptyState = ({ title = "No data found", description = "Try adjusting your search criteria or query terms.", actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl border border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-800/60 text-brand-400 mb-4">
        <Search className="w-8 h-8" />
      </div>
      <h4 className="text-lg font-semibold text-slate-200 mb-1">{title}</h4>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {actionButton}
    </div>
  );
};
