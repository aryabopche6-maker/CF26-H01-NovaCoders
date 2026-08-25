import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquarePlus,
  SlidersHorizontal,
  History,
  Building2,
  TableProperties,
  GitCommit,
  Sparkles,
  Activity,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
  const { user, logout, role } = useAuth();

  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/dashboard', label: 'Platform Dashboard', icon: LayoutDashboard },
          { to: '/admin', label: 'Admin Portal', icon: ShieldCheck },
          { to: '/approvals', label: 'Query Approvals', icon: CheckCircle2 },
          { to: '/institutions', label: 'Federation Nodes', icon: Building2 },
          { to: '/schema-mapping', label: 'Schema Mapping', icon: TableProperties },
          { to: '/audit-logs', label: 'Audit Trail', icon: FileCheck },
          { to: '/provenance', label: 'Lineage & Provenance', icon: GitCommit },
          { to: '/performance', label: 'Network Performance', icon: Activity },
        ];

      case 'INSTITUTION_ADMIN':
        return [
          { to: '/institution-admin', label: 'My Institution Portal', icon: Building2 },
          { to: '/approvals', label: 'Pending Approvals', icon: CheckCircle2 },
          { to: '/institutions', label: 'Federation Status', icon: Activity },
          { to: '/schema-mapping', label: 'Local Schema Mapping', icon: TableProperties },
          { to: '/audit-logs', label: 'Node Audit Trail', icon: FileCheck },
        ];

      case 'AUDITOR':
        return [
          { to: '/auditor', label: 'Auditor Dashboard', icon: ShieldCheck },
          { to: '/audit-logs', label: 'Tamper-Evident Audit Trail', icon: FileCheck },
          { to: '/provenance', label: 'Cryptographic Lineage', icon: GitCommit },
          { to: '/institutions', label: 'Node Governance', icon: Building2 },
        ];

      case 'RESEARCHER':
      default:
        return [
          { to: '/dashboard', label: 'Analytics Dashboard', icon: LayoutDashboard },
          { to: '/ask', label: 'Ask Clinical Data (AI)', icon: MessageSquarePlus },
          { to: '/query-builder', label: 'Query Builder', icon: SlidersHorizontal },
          { to: '/history', label: 'Query History', icon: History },
          { to: '/provenance', label: 'Query Provenance', icon: GitCommit },
          { to: '/performance', label: 'Query Performance', icon: Activity },
        ];
    }
  };

  const navLinks = getNavLinks();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <aside className="w-64 glass-panel border-r border-slate-700/50 text-slate-300 flex flex-col h-screen sticky top-0 z-30 shadow-glass">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-700/50 flex items-center space-x-3">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-glow font-bold text-xl"
        >
          F
        </motion.div>
        <div>
          <h1 className="font-bold text-white tracking-wide text-base">FederateHealth</h1>
          <p className="text-xs text-cyan-400 font-medium tracking-wide">Healthcare Analytics</p>
        </div>
      </div>

      {/* Authenticated User Badge */}
      <div className="p-4 bg-slate-900/40 border-b border-slate-700/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Auth User</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${
            role === 'ADMIN' ? 'bg-purple-900/60 text-purple-300 border border-purple-500/50' :
            role === 'INSTITUTION_ADMIN' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/50' :
            role === 'AUDITOR' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/50' :
            'bg-blue-900/60 text-blue-300 border border-blue-500/50'
          }`}>
            {role.replace('_', ' ')}
          </span>
        </div>
        <div className="text-sm font-semibold text-white truncate mt-1">{user?.name || 'Authorized User'}</div>
        <div className="text-xs text-slate-400 truncate">{user?.email || 'authenticated'}</div>
      </div>

      {/* Navigation Links */}
      <motion.nav 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar"
      >
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <motion.div key={item.to} variants={itemVariants}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-400 border-l-2 border-cyan-400 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-2 border-transparent hover:border-slate-500/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-900/20">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg bg-slate-800/50 hover:bg-red-900/40 text-slate-300 hover:text-red-300 border border-slate-700/50 hover:border-red-800/50 transition-all duration-200 text-sm font-medium group shadow-sm hover:shadow-md"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
