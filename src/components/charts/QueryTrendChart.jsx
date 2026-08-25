import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { HOURLY_QUERY_TREND } from '../../data/analyticsData';

export const QueryTrendChart = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
          Hourly Query Volume
        </h4>
        <span className="text-[10px] text-emerald-400 font-mono shrink-0">Today's Activity</span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={HOURLY_QUERY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
            />
            <Area type="monotone" dataKey="queries" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorQueries)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
