import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const Tooltip = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-flex items-center group">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help inline-flex items-center"
      >
        {children || <HelpCircle className="w-4 h-4 text-slate-400 hover:text-brand-400 transition-colors ml-1" />}
      </div>
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg shadow-xl z-50 pointer-events-none transition-opacity duration-200">
          <div className="font-normal leading-relaxed">{text}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
