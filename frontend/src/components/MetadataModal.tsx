import React from 'react';
import { X } from 'lucide-react';

interface MetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetadataModal({ isOpen, onClose }: MetadataModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[400px] bg-[#0D1B22]/90 backdrop-blur-md border border-[#1A3342] rounded-xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-[#1A3342] text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-lg font-bold text-[#22D3EE] mb-6 tracking-tight uppercase">System Metadata</h2>
        
        <div className="space-y-4 text-sm">
          <div className="flex justify-between border-b border-[#1A3342] pb-3">
            <span className="text-slate-400">Architect</span>
            <span className="font-semibold text-white">Karthik L.</span>
          </div>
          <div className="flex justify-between border-b border-[#1A3342] pb-3">
            <span className="text-slate-400">Batch</span>
            <span className="font-semibold text-white">Batch 2 Interns</span>
          </div>
          <div className="flex justify-between border-b border-[#1A3342] pb-3">
            <span className="text-slate-400">Frontend</span>
            <div className="text-right font-semibold text-white">
              <div>Next.js 16</div>
              <div>Tailwind CSS</div>
              <div>React Leaflet</div>
            </div>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-slate-400">Backend</span>
            <span className="font-semibold text-white">FastAPI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
