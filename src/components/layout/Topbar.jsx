import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export const Topbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Researcher Analytics Dashboard';
      case '/ask': return 'Ask Clinical Data (AI Query Engine)';
      case '/query-builder': return 'Visual Federated Query Builder';
      case '/history': return 'Query Audit & History';
      case '/institutions': return 'Participating Clinical Institutions';
      case '/schema-mapping': return 'Heterogeneous Schema Mapping';
      case '/provenance': return 'Data Lineage & Provenance';
      case '/performance': return 'Federated System Benchmarks';
      case '/audit-logs': return 'Security & Privacy Audit Logs';
      case '/admin': return 'System Administrator Console';
      default:
        if (path.startsWith('/institutions/')) return 'Institution Detail Telemetry';
        return 'Clinical Analytics Fabric';
    }
  };

  const handleQuickDemo = () => {
    navigate('/ask?demo=true');
  };

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center justify-between px-6 bg-slate-950/80 dark:bg-slate-950/80 light:bg-white/90 backdrop-blur-md border-b border-slate-800/80 dark:border-slate-800/80 light:border-slate-200">
      {/* Title & Path */}
      <div className="flex items-center gap-3">
        <h2 className="text-base font-bold text-slate-100 dark:text-white light:text-slate-900">
          {getPageTitle(location.pathname)}
        </h2>
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
          Fabric Status: 3/3 Nodes Active
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Trigger */}
        <button
          onClick={handleQuickDemo}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all transform hover:scale-[1.02]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Run Demo Query</span>
        </button>

        {/* Security Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>k-Anonymity Guard Active</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>
    </header>
  );
};
