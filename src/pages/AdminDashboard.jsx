import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Building2, Activity, AlertTriangle, FileCheck2, Server, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { getInstitutions } from '../services/institutionService';
import { getAuditLogs } from '../services/auditService';

export const AdminDashboard = () => {
  const [institutions, setInstitutions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const instData = await getInstitutions();
      const logData = await getAuditLogs();
      setInstitutions(instData);
      setAuditLogs(logData.slice(0, 5));
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            System Administrator Console
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Monitor fabric node topology, security events, user access tokens, and infrastructure compliance.
        </p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Platform Users" value="142" subtext="Researchers & Admins" icon={Users} />
        <StatCard title="Active Institutions" value="3 / 3" subtext="100% Availability" icon={Building2} color="emerald" />
        <StatCard title="Queries Today" value="24" subtext="Distributed Executions" icon={Activity} />
        <StatCard title="Node Failures" value="0" subtext="Healthy Handshakes" icon={CheckCircle2} color="emerald" />
        <StatCard title="Privacy Violations" value="0" subtext="Zero Data Leaks" icon={ShieldAlert} color="emerald" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Institution Node Control */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-400" />
            <span>Institution Node Infrastructure Status</span>
          </h3>

          <div className="space-y-3">
            {institutions.map((inst) => (
              <div key={inst.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{inst.name}</p>
                  <p className="text-slate-400 font-mono text-[11px] mt-0.5">{inst.dbType} • Latency: {inst.latency}ms</p>
                </div>
                <StatusBadge status={inst.status} text={inst.status.toUpperCase()} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: User Access Management */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Active Registered Researchers</span>
          </h3>

          <div className="space-y-3">
            {[
              { name: "Dr. Sarah Lin", email: "researcher@demo.com", role: "Senior Researcher", queries: 48, status: "Active" },
              { name: "Marcus Vance", email: "admin@demo.com", role: "System Admin", queries: 12, status: "Active" },
              { name: "Dr. Robert Chen", email: "r.chen@stanford.edu", role: "Clinical Fellow", queries: 31, status: "Active" }
            ].map((usr) => (
              <div key={usr.email} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{usr.name}</p>
                  <p className="text-slate-400 text-[11px]">{usr.email} • {usr.role}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                  {usr.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
