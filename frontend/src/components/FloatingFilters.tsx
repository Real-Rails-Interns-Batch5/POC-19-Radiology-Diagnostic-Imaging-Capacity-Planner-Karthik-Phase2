"use client";

import React from 'react';
import Papa from 'papaparse';
import { Hospital } from '@/lib/api';
import { Download } from 'lucide-react';

interface FloatingFiltersProps {
  hospitals: Hospital[];
  regions: string[];
  filters: any;
  setFilters: (f: any) => void;
}

export function FloatingFilters({ hospitals, regions, filters, setFilters }: FloatingFiltersProps) {

  const handleDownload = () => {
    if (hospitals.length === 0) return;
    const csv = Papa.unparse(hospitals);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'capacity_planner_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed top-14 left-4 w-[320px] bg-[#0D1B22]/90 backdrop-blur-md border border-[#1A3342] rounded-xl p-5 shadow-2xl z-40 flex flex-col gap-5 max-h-[calc(100vh-4.5rem)] overflow-y-auto">

      
      {/* Title block */}
      <div className="mb-4">
        <p className="text-[9px] font-bold tracking-widest text-[#22D3EE] uppercase mb-2">
          Healthcare Intelligence
        </p>
        <h1 className="text-xl font-light tracking-tight text-white mb-1 leading-tight">
          Radiology Capacity Planner
        </h1>
        <p className="text-[11px] font-medium tracking-widest text-slate-400 uppercase mb-4">
          GCC Diagnostic Network
        </p>
        
        <div className="inline-flex items-baseline gap-2 bg-[#1A3342]/30 border border-[#1A3342] rounded-full px-4 py-1.5">
          <span className="text-xl font-medium text-[#22D3EE] transition-all duration-300">
            {hospitals.length}
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Active Hospitals
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-5">
        {/* Region */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1.5 pl-1">
            Region
          </label>
          <select
            className="w-full bg-[#06141B]/60 border border-[#1A3342] hover:border-[#1A3342]/80 text-white text-[11px] font-medium tracking-wide rounded-full px-4 py-2 outline-none focus:border-[#22D3EE]/50 transition-all appearance-none cursor-pointer"
            value={filters.region || ""}
            onChange={e => setFilters({ ...filters, region: e.target.value })}
          >
            <option value="">All Regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Modality */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1.5 pl-1">
            Modality
          </label>
          <div className="flex bg-[#06141B]/40 p-1 rounded-full border border-[#1A3342]/50">
            {["", "MRI", "CT"].map(val => (
              <button
                key={val}
                className={`flex-1 py-1.5 rounded-full capitalize transition-all duration-300 text-[10px] font-semibold tracking-wide ${
                  filters.modality === val
                    ? 'bg-[#1A3342] text-[#22D3EE] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1A3342]/40'
                }`}
                onClick={() => setFilters({ ...filters, modality: val })}
              >
                {val || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Maintenance Status */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1.5 pl-1">
            Maintenance Status
          </label>
          <div className="grid grid-cols-2 bg-[#06141B]/40 p-1 rounded-3xl border border-[#1A3342]/50 gap-1">
            {["", "operational", "partial", "under_maintenance"].map(val => (
              <button
                key={val}
                className={`py-1.5 px-2 rounded-full capitalize transition-all duration-300 text-[9px] font-semibold tracking-wide text-center ${
                  filters.maintenance_status === val
                    ? 'bg-[#1A3342] text-[#22D3EE] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1A3342]/40'
                }`}
                onClick={() => setFilters({ ...filters, maintenance_status: val })}
              >
                {val ? val.replace('_', ' ') : "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Alert Level */}
        <div>
          <label className="block text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-1.5 pl-1">
            Alert Level
          </label>
          <div className="flex bg-[#06141B]/40 p-1 rounded-full border border-[#1A3342]/50 gap-1">
            {["", "critical", "warning", "normal"].map(val => (
              <button
                key={val}
                className={`flex-1 py-1.5 rounded-full capitalize transition-all duration-300 text-[9px] font-semibold tracking-wide ${
                  filters.alert_level === val
                    ? 'bg-[#1A3342] text-[#22D3EE] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#1A3342]/40'
                }`}
                onClick={() => setFilters({ ...filters, alert_level: val })}
              >
                {val || "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-6 border-t border-[#1A3342]/50">
        <button
          onClick={handleDownload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-[11px] font-semibold tracking-widest uppercase text-white bg-gradient-to-r from-[#22D3EE]/20 to-[#1A3342]/40 border border-[#22D3EE]/30 hover:from-[#22D3EE]/30 hover:to-[#1A3342]/60 hover:border-[#22D3EE]/60 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300"
        >
          <Download size={14} />
          Export Dataset
        </button>
      </div>
    </div>
  );
}
