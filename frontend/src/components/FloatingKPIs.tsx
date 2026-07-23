import React from 'react';
import { KPISummary } from '@/lib/api';
import { Activity, Magnet, CircleDot, Clock, TrendingDown } from 'lucide-react';

export function FloatingKPIs({ kpis }: { kpis: KPISummary | null }) {
  if (!kpis) return null;

  const items = [
    { label: "Total MRI",          value: kpis.total_mri_scanners,         icon: Magnet },
    { label: "Total CT",           value: kpis.total_ct_scanners,          icon: CircleDot },
    { label: "Avg Utilization",    value: `${kpis.avg_utilization_pct}%`,  icon: Activity },
    { label: "Avg Wait",           value: `${kpis.avg_wait_time_days}d`,   icon: Clock },
    { label: "Capacity Gap",       value: kpis.avg_capacity_gap_index,     icon: TrendingDown },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex gap-5 pointer-events-none">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="group bg-[#0D1B22]/90 backdrop-blur-md border border-[#1A3342] hover:border-[#22D3EE]/50 rounded-2xl px-5 py-3 flex items-center gap-4 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:-translate-y-0.5 transition-all duration-300 pointer-events-auto"
          >
            <div className="p-2 rounded-full bg-[#22D3EE]/10 text-[#22D3EE] group-hover:bg-[#22D3EE]/20 transition-colors">
              <Icon size={18} />
            </div>
            <div className="flex flex-col items-start justify-center">
              <p className="text-2xl font-light text-white tracking-tight leading-none mb-1">
                {item.value}
              </p>
              <p className="text-[10px] font-medium tracking-widest text-slate-500 uppercase leading-none">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
