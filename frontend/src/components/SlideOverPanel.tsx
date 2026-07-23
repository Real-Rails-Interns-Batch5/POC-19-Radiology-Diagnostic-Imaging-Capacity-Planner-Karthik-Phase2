"use client";

import React from 'react';
import { Hospital } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { X } from 'lucide-react';

interface SlideOverPanelProps {
  hospital: Hospital | undefined | null;
  waitTrend: any;
  onClose: () => void;
}

export function SlideOverPanel({ hospital, waitTrend, onClose }: SlideOverPanelProps) {
  const isOpen = !!hospital;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[380px] bg-[#0D1B22]/90 backdrop-blur-xl border-l border-[#1A3342]/60 shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-50 flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-[#1A3342]/60">
        <h2 className="text-xl font-light text-white tracking-tight">
          {hospital?.name || 'Hospital Details'}
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-[#1A3342] text-slate-400 hover:text-white transition-all duration-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
        {hospital && (
          <>
            {/* Status Strip */}
            <div className="flex gap-3">
              <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                hospital.alert_level === 'critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                hospital.alert_level === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30'
              }`}>
                {hospital.alert_level}
              </span>
              <span className="px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-[#1A3342]/40 text-slate-300 border border-[#1A3342]/50">
                Priority: {hospital.replacement_priority}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-4 transition-colors hover:border-[#22D3EE]/40">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Utilization</p>
                <p className="text-2xl font-light text-white tracking-tight">{hospital.daily_utilization_pct}%</p>
              </div>
              <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-4 transition-colors hover:border-[#22D3EE]/40">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Avg Wait</p>
                <p className="text-2xl font-light text-white tracking-tight">{hospital.avg_wait_time_days}d</p>
              </div>
              <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-4 transition-colors hover:border-[#22D3EE]/40">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Capacity Gap</p>
                <p className="text-2xl font-light text-white tracking-tight">{hospital.capacity_gap_index.toFixed(2)}</p>
              </div>
              <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-4 transition-colors hover:border-[#22D3EE]/40">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Volume</p>
                <p className="text-2xl font-light text-white tracking-tight">{hospital.daily_scan_volume}</p>
              </div>
            </div>

            {/* Equipment Info */}
            <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-5">
              <h3 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-4">Equipment Information</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Type</span>
                  <span className="font-light text-white bg-[#1A3342]/30 px-2 py-1 rounded-md">{hospital.equipment_type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">MRI Scanners</span>
                  <span className="font-light text-white">{hospital.mri_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">CT Scanners</span>
                  <span className="font-light text-white">{hospital.ct_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Avg Age</span>
                  <span className="font-light text-white">{hospital.equipment_age_years} yrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Maintenance</span>
                  <span className="font-light text-white capitalize">{hospital.maintenance_status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Wait Time Trend Chart */}
            <div className="bg-[#06141B]/40 border border-[#1A3342]/50 rounded-xl p-5 flex flex-col min-h-[240px]">
              <h3 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-4">Wait-Time Trend (12m)</h3>
              <div className="flex-grow">
                {waitTrend && waitTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={waitTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1A3342" vertical={false} />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} tickMargin={5} />
                      <YAxis stroke="#9CA3AF" fontSize={10} tickMargin={5} />
                      <Tooltip contentStyle={{ backgroundColor: '#0D1B22', borderColor: '#1A3342', color: '#fff' }} />
                      <Line type="monotone" dataKey="avg_wait_days" stroke="#22D3EE" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-gray-500">No data available</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
