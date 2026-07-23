"use client";

import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState
} from '@tanstack/react-table';
import { Hospital } from '@/lib/api';
import { ArrowUpDown } from 'lucide-react';

export function HospitalsTable({ data, onRowClick, selectedId }: { data: Hospital[], onRowClick: (id: string) => void, selectedId: string | null }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = React.useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Hospital Name',
        cell: (info: any) => <div className="font-medium text-slate-200">{info.getValue()}</div>,
      },
      {
        accessorKey: 'region',
        header: 'Region',
      },
      {
        accessorKey: 'mri_count',
        header: 'MRI',
      },
      {
        accessorKey: 'ct_count',
        header: 'CT',
      },
      {
        accessorKey: 'daily_utilization_pct',
        header: 'Utilization %',
        cell: (info: any) => `${info.getValue()}%`,
      },
      {
        accessorKey: 'avg_wait_time_days',
        header: 'Wait Days',
        cell: (info: any) => `${info.getValue()}d`,
      },
      {
        accessorKey: 'alert_level',
        header: 'Alert Level',
        cell: (info: any) => {
          const val = info.getValue() as string;
          let color = 'bg-slate-500/20 text-slate-300';
          if (val === 'critical') color = 'bg-red-500/20 text-red-400 border border-red-500/50';
          else if (val === 'warning') color = 'bg-amber-500/20 text-amber-400 border border-amber-500/50';
          else if (val === 'normal') color = 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/50'; // cyan for normal
          
          return (
            <span className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider ${color}`}>
              {val}
            </span>
          );
        },
      },
      {
        accessorKey: 'replacement_priority',
        header: 'Priority',
        cell: (info: any) => <span className="capitalize text-sm">{info.getValue()}</span>
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="bg-[#0D1B22] border border-[#1A3342] rounded-xl overflow-hidden relative flex-grow flex flex-col min-h-[300px] shadow-[0_0_12px_rgba(56,189,248,0.04)]">
      <div className="overflow-auto flex-grow relative scrollbar-thin scrollbar-thumb-gray-700">
        <table className="w-full text-sm text-left text-slate-200">
          <thead className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase bg-[#0D1B22] sticky top-0 z-20 border-b border-[#1A3342]">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 cursor-pointer hover:text-white select-none whitespace-nowrap bg-[#0D1B22]"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown size={12} className="text-slate-500" />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[#1A3342]">
            {table.getRowModel().rows.map(row => {
              const isSelected = row.original.id === selectedId;
              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick(row.original.id)}
                  className={`hover:bg-[#1A3342]/50 cursor-pointer transition-colors ${isSelected ? 'bg-[#22D3EE]/10' : ''}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap text-sm text-slate-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">
                  No hospitals found for the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
